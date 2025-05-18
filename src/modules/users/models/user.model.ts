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
        customer: true,
        employee: true,
      },
    });

    return users;
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
