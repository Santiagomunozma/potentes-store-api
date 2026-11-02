import { prisma } from "../../../config/prisma";

// Type definitions
export type User = {
  id?: string;
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  identificationType: string;
  identificationNumber: string;
  createdAt?: Date;
  updatedAt?: Date;

  customer?: Customer;
  employee?: Employee;
};

export type Customer = {
  id?: string;
  userId?: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Employee = {
  id?: string;
  userId?: string;
  salary: number;
  employeeType: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Database operations (Model functionality)
export const UserModel = {
  findAll: async () => {
    const users = await prisma.user.findMany({
      include: {
        customer: {
          include: { _count: { select: { sells: true } } },
        },
        employee: {
          include: { _count: { select: { sells: true } } },
        },
      },
    });

    return users;
  },

  getStats: async () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const [
      totalUsers,
      customers,
      employees,
      newUsers,
      lastMonthTotal,
      lastMonthCustomers,
      lastMonthEmployees,
      lastMonthNew,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { userType: "Customer" } }),
      prisma.user.count({ where: { userType: "Employee" } }),
      prisma.user.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
      prisma.user.count({ where: { createdAt: { lt: firstDayOfMonth } } }),
      prisma.user.count({
        where: { userType: "Customer", createdAt: { lt: firstDayOfMonth } },
      }),
      prisma.user.count({
        where: { userType: "Employee", createdAt: { lt: firstDayOfMonth } },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: firstDayOfLastMonth, lt: firstDayOfMonth },
        },
      }),
    ]);

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    };

    return [
      {
        label: "Total usuarios",
        value: totalUsers.toString(),
        change: calculateChange(totalUsers, lastMonthTotal),
      },
      {
        label: "Clientes",
        value: customers.toString(),
        change: calculateChange(customers, lastMonthCustomers),
      },
      {
        label: "Empleados",
        value: employees.toString(),
        change: calculateChange(employees, lastMonthEmployees),
      },
      {
        label: "Usuarios nuevos",
        value: newUsers.toString(),
        change: calculateChange(newUsers, lastMonthNew),
      },
    ];
  },

  create: async (data: User) => {
    const { customer, employee, ...user } = data;

    const newUser = prisma.user.create({
      data: {
        ...user,
        customer: customer ? { create: customer } : undefined,
        employee: employee ? { create: employee } : undefined,
      },
    });

    return newUser;
  },

  update: async (data: User) => {
    const { customer, employee, ...user } = data;

    const updatedUser = prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        customer: customer ? { update: customer } : undefined,
        employee: employee ? { update: employee } : undefined,
      },
    });

    return updatedUser;
  },

  delete: async (id: string) => {
    await prisma.customer.deleteMany({
      where: {
        userId: id,
      },
    });

    await prisma.employee.deleteMany({
      where: {
        userId: id,
      },
    });

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    return deletedUser;
  },

  findById: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        employee: true,
      },
    });

    return user;
  },

  findByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        customer: true,
        employee: true,
      },
    });
    return user;
  },
};
