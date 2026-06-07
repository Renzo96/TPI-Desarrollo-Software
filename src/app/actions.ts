"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const sku = formData.get("sku") as string
  const category = formData.get("category") as string
  const price = parseFloat(formData.get("price") as string)
  const quantity = parseInt(formData.get("quantity") as string)
  const minStock = parseInt(formData.get("minStock") as string)
  const unit = formData.get("unit") as string

  await prisma.product.create({
    data: { name, description, sku, category, price, quantity, minStock, unit },
  })

  revalidatePath("/products")
  redirect("/products")
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const sku = formData.get("sku") as string
  const category = formData.get("category") as string
  const price = parseFloat(formData.get("price") as string)
  const quantity = parseInt(formData.get("quantity") as string)
  const minStock = parseInt(formData.get("minStock") as string)
  const unit = formData.get("unit") as string

  await prisma.product.update({
    where: { id },
    data: { name, description, sku, category, price, quantity, minStock, unit },
  })

  revalidatePath("/products")
  redirect("/products")
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath("/products")
}

export async function registerMovement(formData: FormData) {
  const productId = formData.get("productId") as string
  const type = formData.get("type") as string
  const quantity = parseInt(formData.get("quantity") as string)
  const reason = formData.get("reason") as string

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw new Error("Producto no encontrado")

  const newQuantity = type === "entrada" ? product.quantity + quantity : product.quantity - quantity

  if (newQuantity < 0) throw new Error("Stock insuficiente")

  await prisma.$transaction([
    prisma.movement.create({
      data: { type, quantity, reason, productId },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { quantity: newQuantity },
    }),
  ])

  revalidatePath("/movements")
  revalidatePath("/")
}
