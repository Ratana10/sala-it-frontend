"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  InvoiceData,
  ISchoolInfo,
  openInvoicePrint,
  SchoolInvoiceTemplate,
} from "../../../templates/school-invoice-template";
import { CirclePlusIcon, DownloadIcon, Trash2Icon } from "lucide-react";
import { InvoiceFormValues, invoiceSchema } from "@/schemas/invoice";

type Item = {
  id: number;
  description: string;
  discount: number | string;
  amount: number | string;
};

export default function InvoiceClient() {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "(+855)12 345 678",
    },
  });

  const [items, setItems] = useState<Item[]>([
    { id: 1, description: "Course", discount: 0, amount: 60 },
  ]);

  const schoolInfo: ISchoolInfo = {
    logoUrl: "/logo/sala-it_logo.jpg",
    name: "Sala-IT",
    phone: "(+855)11 504 463",
    telegram: "@phanith_noch",
    telegramUrl: "https://t.me/phanith_noch",
    email: "nochphanith@gmail.com",
    website: "app.salaitdevelopment.com",
    websiteUrl: "https://app.salaitdevelopment.com",
    slogan:
      "Thank you for choosing Sala-IT. Unlock your potential and grow with technology!",
    remark: "Once payment has been made, it cannot be refunded.",
    signatureUrl: "/signature.png",
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const calculateTotalWithDiscount = (
    items: { amount: number | string; discount: number | string }[]
  ) => {
    return items.reduce((sum, item) => {
      const amount = Number(item.amount) || 0;
      const discount = Number(item.discount) || 0;
      const discounted = amount - (amount * discount) / 100;
      return sum + discounted;
    }, 0);
  };

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "", discount: 0, amount: 0 },
    ]);

  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const updateItem = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (field === "discount" || field === "amount") {
          return { ...it, [field]: value === "" ? "" : Number(value) };
        }
        return { ...it, [field]: value };
      })
    );
  };

  const handlePrint = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    const values = form.getValues();

    const data: InvoiceData = {
      invoiceDate: today,
      schoolInfo,
      studentInfo: {
        name: values.name,
        email: values.email,
        phone: values.phone,
      },
      items: items.map((i) => ({
        ...i,
        amount: Number(i.amount) || 0,
        discount: Number(i.discount) || 0,
      })),
      totalAmount: calculateTotalWithDiscount(items),
    };

    const html = SchoolInvoiceTemplate(data);
    await openInvoicePrint(html);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 grid md:grid-cols-2 gap-6">
      {/* ========== LEFT: FORM ========== */}
      <Card className="shadow-md print:hidden">
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Invoice</h2>
            <Button
              onClick={handlePrint}
              size="sm"
              className="text-white cursor-pointer"
              variant="default"
            >
              <DownloadIcon className="w-4 h-4" /> Download PDF
            </Button>
          </div>

          <Form {...form}>
            <form className="space-y-6">
              {/* Student Info */}
              <div>
                <h3 className="font-medium mb-2">Student Information</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email{" "}
                          <span className="text-muted-foreground">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter mail address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone{" "}
                          <span className="text-muted-foreground">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="(+855)..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <h3 className="font-medium">Course Items</h3>
                  <Button
                    onClick={addItem}
                    type="button"
                    size="sm"
                    className="text-black cursor-pointer"
                    variant="outline"
                  >
                    <CirclePlusIcon className="w-4 h-4" /> Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-2 text-sm font-medium text-gray-600">
                    <span>Description</span>
                    <span className="text-center">Discount (%)</span>
                    <span className="text-center">Amount (USD)</span>
                    <span className="text-center">Action</span>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-2 items-start sm:grid-cols-[2fr_1fr_1fr_auto] grid-cols-1 border border-gray-200 sm:border-0 p-2 sm:p-0 rounded-md bg-white sm:bg-transparent"
                    >
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        className="min-h-[60px] resize-none w-full"
                        placeholder="Enter course details..."
                      />

                      <Input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          updateItem(item.id, "discount", e.target.value)
                        }
                        className="w-full"
                        placeholder="Discount"
                      />

                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(item.id, "amount", e.target.value)
                        }
                        className="w-full"
                        placeholder="Amount"
                      />

                      <div className="flex justify-end sm:justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white w-7 h-7 cursor-pointer"
                          disabled={items.length === 1}
                        >
                          <Trash2Icon className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ========== RIGHT: PREVIEW ========== */}
      <Card className="shadow-lg border border-gray-200 print:shadow-none print:border-0 overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-6 text-sm text-gray-800">
          <div className="text-center">
            <img
              src={schoolInfo.logoUrl}
              alt="Sala-IT Logo"
              className="w-28 sm:w-40 h-auto mx-auto mb-2"
            />
            <p className="text-xs sm:text-sm text-black text-end">
              Invoice Date: {today}
            </p>
          </div>

          <div className="text-sm mb-4 space-y-1">
            <p className="font-bold text-[14px]">{schoolInfo.name}</p>
            <p>Phone: {schoolInfo.phone}</p>
            <p>
              Telegram:{" "}
              <a
                href={schoolInfo.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {schoolInfo.telegram}
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href={`mailto:${schoolInfo.email}`}
                className="text-blue-500 underline"
              >
                {schoolInfo.email}
              </a>
            </p>
            <p>
              Website:{" "}
              <a
                href={schoolInfo.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {schoolInfo.website}
              </a>
            </p>
          </div>

          <div className="text-sm mb-4 space-y-1">
            <p className="font-bold">Student Information</p>
            <p>Student Name: {form.watch("name")}</p>
            <p>Email: {form.watch("email")}</p>
            <p>Phone: {form.watch("phone")}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-black border-collapse text-xs sm:text-sm">
              <thead className="bg-[#A4C1E2] text-center text-black">
                <tr>
                  <th className="border border-black px-2 py-1 w-[5%]">No</th>
                  <th className="border border-black px-2 py-1 w-[50%] text-left">
                    Description
                  </th>
                  <th className="border border-black px-2 py-1 w-[20%] text-center">
                    Discount (%)
                  </th>
                  <th className="border border-black px-2 py-1 w-[25%] text-center">
                    Amount (USD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-black px-2 py-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black px-3 py-2 break-words">
                      {item.description}
                    </td>
                    <td className="border border-black px-3 py-2 text-center">
                      {item.discount}
                    </td>
                    <td className="border border-black px-3 py-2 text-right">
                      {Number(item.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-gray-50">
                  <td
                    colSpan={3}
                    className="border border-black px-3 py-2 text-right"
                  >
                    Total Amount (USD)
                  </td>
                  <td className="border border-black px-3 py-2 text-right">
                    {calculateTotalWithDiscount(items).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <p className="font-semibold">Remark:</p>
            <p className="text-red-500">{schoolInfo.remark}</p>
          </div>

          <div className="mt-4">
            <p className="font-semibold">Signature:</p>
            <img
              src={schoolInfo.signatureUrl}
              alt="Signature"
              className="w-32 h-auto mb-2"
            />
          </div>

          <p className="text-center text-xs sm:text-sm text-black mt-6">
            {schoolInfo.slogan}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
