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
} from "../../../templates/school-invoice-template";
import { DownloadIcon, Trash2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type Item = {
  id: number;
  description: string;
  discount: number;
  amount: number;
};

const InvoiceClient = () => {
  const [student, setStudent] = useState({
    name: "Name",
    email: "@gmail.com",
    phone: "(+855)12 345 678",
  });

  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      description: "Course",
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
    signatureUrl: "./signature.png",
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 grid md:grid-cols-2 gap-6">
      {/* ================= Left Side: Form ================= */}
      <Card className="shadow-md print:hidden">
        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Print Button on Left Panel */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Invoice</h2>
            <Button
              onClick={handlePrint}
              size="sm"
              className="text-white"
              variant="default"
            >
              <DownloadIcon className="w-4 h-4 mr-1" /> Print PDF
            </Button>
          </div>

          {/* Student Info */}
          <div>
            <h3 className="font-medium mb-2">Student Information</h3>
            <div className="space-y-3">
              {["name", "email", "phone"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label className="capitalize">
                    {field}{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    value={student[field as keyof typeof student]}
                    onChange={(e) =>
                      setStudent({ ...student, [field]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="font-medium">Course Items</h3>
              <Button
                onClick={addItem}
                size="sm"
                className="text-black cursor-pointer"
                variant="outline"
              >
                + Add Item
              </Button>
            </div>

            <div className="space-y-2">
              {/* Header labels - hide on mobile */}
              <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-2 text-sm font-medium text-gray-600">
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
                    className="grid gap-2 items-start sm:grid-cols-[2fr_1fr_1fr_auto] grid-cols-1 border border-gray-200 sm:border-0 p-2 sm:p-0 rounded-md bg-white sm:bg-transparent"
                  >
                    {/* Description */}
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="min-h-[60px] resize-none w-full"
                      placeholder="Enter course details..."
                    />

                    {/* Discount */}
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        updateItem(item.id, "discount", Number(e.target.value))
                      }
                      className="w-full"
                      placeholder="Discount"
                    />

                    {/* Amount */}
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(item.id, "amount", Number(e.target.value))
                      }
                      className="w-full"
                      placeholder="Amount"
                    />

                    {/* Action Button */}
                    <div className="flex justify-end sm:justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white w-7 h-7"
                        disabled={items.length === 1}
                      >
                        <Trash2Icon className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Remark */}
          <div>
            <Label>Remark</Label>
            <Input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter remark..."
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= Right Side: Invoice Preview ================= */}
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
            <p>Student Name: {student.name}</p>
            <p>Email: {student.email}</p>
            <p>Phone: {student.phone}</p>
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


export default InvoiceClient