"use server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db/db";
import {
  type InsertOrganizationType,
  organizations,
} from "@/lib/db/schema/organization";
import { type OrganizationFormSchema } from "@/lib/form-schema/organization-form";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function createOrganization() {
  const userId = handleAuth();

  const newOrganization: InsertOrganizationType = {
    id: uuidv4(),
    userId,
  };

  try {
    const data = await db
      .insert(organizations)
      .values(newOrganization)
      .returning();

    return {
      data: data[0],
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to create organization." },
    };
  }
}

export async function getOrganization() {
  const userId = handleAuth();

  try {
    const data = await db.query.organizations.findFirst({
      where: eq(organizations.userId, userId),
    });

    if (data) {
      return {
        data: data,
        error: null,
      };
    }
    const { data: newOrganization, error } = await createOrganization();

    if (error) {
      return {
        data: null,
        error: { message: error.message },
      };
    }

    return {
      data: newOrganization,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to get organization." },
    };
  }
}

export async function updateOrganization(org: Partial<OrganizationFormSchema>) {
  const userId = handleAuth();

  try {
    await db
      .update(organizations)
      .set(org)
      .where(
        and(
          eq(organizations.id, org.id ?? ""),
          eq(organizations.userId, userId),
        ),
      );

    revalidatePath("/settings");

    return {
      data: { message: "Organization updated successfully" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to update organization." },
    };
  }
}
