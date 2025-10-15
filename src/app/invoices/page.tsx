"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  InvoiceData,
  ISchoolInfo,
  openInvoicePrint,
  SchoolInvoiceTemplate,
} from "../../templates/school-invoice-template";
import { DownloadIcon, Trash2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type Item = {
  id: number;
  description: string;
  discount: number;
  amount: number;
};

export default function InvoiceBuilder() {
  const [student, setStudent] = useState({
    name: "San Ratana",
    email: "sanratana18@gmail.com",
    phone: "(+855)96 434 7813",
  });

  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      description: "Basic Web Development course",
      discount: 0,
      amount: 60,
    },
  ]);

  const [remark, setRemark] = useState(
    "Please note that once payment has been made, it cannot be refunded."
  );

  const schoolInfo: ISchoolInfo = {
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWq-PBHFpHVPjKxchEcimpzIU0fdeIE37yzQ&s",
    name: "Sala-IT",
    phone: "(+855)11 504 463",
    telegram: "@phanith_noch",
    telegramUrl: "https://t.me/phanith_noch",
    email: "nochphanith@gmail.com",
    website: "app.salaitdevelopment.com",
    websiteUrl: "https://app.salaitdevelopment.com",
    slogan:
      "Thank you for choosing Sala-IT. Unlock your potential and grow with technology!",
    remark: "Once payment has been made, it cannot be refunded,",
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "", discount: 0, amount: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value as never } : it))
    );
  };

  const handlePrint = async () => {
    const data: InvoiceData = {
      invoiceDate: today,
      schoolInfo: schoolInfo,
      studentInfo: {
        name: student.name,
        email: student.email,
        phone: student.phone,
      },

      items,
    };

    const html = SchoolInvoiceTemplate(data);
    await openInvoicePrint(html);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 grid md:grid-cols-2 gap-6">
      {/* ================= Left Side: Form ================= */}
      <Card className="shadow-md print:hidden">
        <CardContent className="p-6 space-y-6">
          {/* Print Button on Left Panel */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Invoice</h2>
            <Button
              onClick={handlePrint}
              size="sm"
              className=" text-white"
              variant={"default"}
            >
              <DownloadIcon className="w-4 h-4" /> Print PDF
            </Button>
          </div>

          {/* Student Info */}
          <div>
            <h3 className="font-medium mb-2">Student Information</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>
                  Name <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  value={student.name}
                  onChange={(e) =>
                    setStudent({ ...student, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Email{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  value={student.email}
                  onChange={(e) =>
                    setStudent({ ...student, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Phone{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  value={student.phone}
                  onChange={(e) =>
                    setStudent({ ...student, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Course Items</h3>
              <Button
                onClick={addItem}
                size="sm"
                className=" text-black cursor-pointer"
                variant={"outline"}
              >
                + Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {/* Header labels - show only once */}
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 text-sm font-medium text-gray-600">
                <span>Description</span>
                <span className="text-center">Discount (%)</span>
                <span className="text-center">Amount (USD)</span>
                <span className="text-center">Action</span>
              </div>

              {/* Input rows */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-start"
                  >
                    {/* Description (takes 2x more space) */}
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="min-h-[60px] resize-none"
                      placeholder="Enter course details..."
                    />

                    {/* Discount */}
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        updateItem(item.id, "discount", Number(e.target.value))
                      }
                    />

                    {/* Amount */}
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(item.id, "amount", Number(e.target.value))
                      }
                    />

                    {/* Action (smaller fixed width) */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white w-7 h-7 flex-shrink-0"
                      disabled={items.length === 1}
                    >
                      <Trash2Icon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Remark */}
          <div>
            <Label>Remark</Label>
            <Input value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* ================= Right Side: Invoice Preview ================= */}
      <Card className="shadow-lg border border-gray-200 print:shadow-none print:border-0">
        <CardContent className="p-6 space-y-6 text-sm text-gray-800">
          <div className="text-center">
            <img
              src={schoolInfo.logoUrl}
              alt="Sala-IT Logo"
              className="w-40 h-40 mx-auto mb-2"
            />
            <p className="text-sm text-black text-end">Invoice Date: {today}</p>
          </div>

          <div className="text-sm mb-4 space-y-1">
            <p className="font-bold text-[14px]">{schoolInfo.name}</p>
            <p>Phone: {schoolInfo.phone}</p>
            <p>
              Telegram:
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
            <p>Student Name: {student.name}</p>
            <p>Email: {student.email}</p>
            <p>Phone: {student.phone}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-black border-collapse text-sm">
              <thead className="bg-[#A4C1E2] text-center text-black">
                <tr>
                  <th className="border border-black px-2 py-1 text-left">
                    No
                  </th>
                  <th className="border border-black px-2 py-1 text-center">
                    Description
                  </th>
                  <th className="border border-black px-2 py-1 text-center">
                    Discount (%)
                  </th>
                  <th className="border border-black px-2 py-1 text-center">
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
                    <td className="border border-black px-3 py-2">
                      {item.description}
                    </td>
                    <td className="border border-black px-3 py-2 text-center">
                      {item.discount}
                    </td>
                    <td className="border border-black px-3 py-2 text-right">
                      ${Number(item.amount || 0).toFixed(2)}
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
                    {items
                      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <p className="font-semibold">Remark:</p>
            <p className="text-red-500">{schoolInfo.remark}</p>
          </div>

          <p className="text-center text-xs text-black mt-6">
            {schoolInfo.slogan}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
