"use server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { db } from "../db/db";
import { type InsertClientType, clients } from "../db/schema/client";
import { type ClientFormType } from "../form-schema/client-form";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getAllClients() {
  const userId = handleAuth();

  try {
    const data = await db.query.clients.findMany({
      where: eq(clients.userId, userId),
    });

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to get clients" },
    };
  }
}

export async function getClientById(id: string) {
  const userId = handleAuth();

  try {
    const data = await db.query.clients.findFirst({
      where: and(eq(clients.id, id), eq(clients.userId, userId)),
    });

    if (!data)
      return {
        data: null,
        error: { message: "Client not found" },
      };

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to get client" },
    };
  }
}

export async function addClient(client: ClientFormType) {
  const userId = handleAuth();

  const newClient: InsertClientType = {
    ...client,
    id: uuidv4(),
    userId: userId,
  };

  try {
    await db.insert(clients).values(newClient);

    revalidatePath("/clients");

    return {
      data: { message: "Client added successfully" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to add client" },
    };
  }
}

export async function updateClient(client: InsertClientType) {
  const userId = handleAuth();

  if (!client.id) throw new Error("Client id is required");

  try {
    await db
      .update(clients)
      .set(client)
      .where(and(eq(clients.id, client.id), eq(clients.userId, userId)));

    revalidatePath("/clients");

    return {
      data: { message: "Client updated successfully" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to update client" },
    };
  }
}

export async function deleteClient(id: string) {
  const userId = handleAuth();

  try {
    await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, userId)));

    revalidatePath("/clients");

    return {
      data: { message: "Client deleted successfully" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to delete client" },
    };
  }
}
