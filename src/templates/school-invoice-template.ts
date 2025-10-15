// lib/school-invoice-template.ts

export type InvoiceItem = {
  id: number;
  description: string;
  discount: number;
  amount: number;
};

export interface ISchoolInfo {
  logoUrl: string;
  name: string;
  phone: string;
  telegram: string;
  telegramUrl: string;
  email: string;
  website: string;
  websiteUrl: string;
  slogan: string;
  remark: string;
  signatureUrl: string;
}

export interface IStudentInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export type InvoiceData = {
  invoiceDate: string;
  schoolInfo: ISchoolInfo;
  studentInfo: IStudentInfo;

  items: InvoiceItem[];
};

export function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function SchoolInvoiceTemplate(data: InvoiceData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice - Sala-IT</title>

<!-- Add Tailwind CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<style>
   @page {
    size: A4;
    margin: 15mm;
  }
    
  @page {
      @bottom-center { content: none; }
      @bottom-right { content: none; }
      @bottom-left { content: none; }
      @top-left { content: none; }
      @top-right { content: none; }
      @top-center { content: none; }
    }

  @media print {
    @page { size: A4; margin: 15mm; }
    body { background: white; color: black; font-family: "Times New Roman", Times, serif; }
    thead th {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      margin: 0;
    }
  }
</style>
</head>
<body class="font-sans text-gray-900 p-6">

  <div class="text-center mb-6">
    <img src="${
      data.schoolInfo.logoUrl
    }" alt="Sala-IT Logo" class="w-40 h-40 mx-auto mb-2" />
  </div>

  <div class="text-sm mb-4 space-y-1 text-end">
    <p><strong>Invoice Date:</strong> ${data.invoiceDate}</p>
  </div>

  <!-- School Information -->
  <div class="text-sm mb-4 space-y-1">
    <p class="font-bold text-[14px]">${data.schoolInfo.name}</p>
    <p>Phone: ${data.schoolInfo.phone}</p>
    <p> Telegram: 
    <a href="${
      data.schoolInfo.telegramUrl
    }" target="_blank" rel="noopener noreferrer"
        class="text-blue-500 underline"
      >
      ${data.schoolInfo.telegram}
      </a>
    </p>
    <p>Email:
      <a
        href="mailto:${data.schoolInfo.email}"
        class="text-blue-500 underline"
      >
        ${data.schoolInfo.email}
      </a>
    </p>
    <p>Website: 
    <a href="${
      data.schoolInfo.websiteUrl
    }" target="_blank" rel="noopener noreferrer"
        class="text-blue-500 underline"
      >
      ${data.schoolInfo.website}
      </a>
      </p>
  </div>

  <!-- Student Information -->
  <div class="text-sm mb-4 space-y-1">
    <p><strong>Student Information</strong></p>
    <p>Student Name: ${data.studentInfo.name ?? "N/A"}</p>
    <p>Email: ${data.studentInfo.email ?? "N/A"}</p>
    <p>Phone: ${data.studentInfo.phone ?? "N/A"}</p>
  </div>

  <table class="w-full border border-black border-collapse text-sm">
    <thead class="bg-[#A4C1E2] text-center text-black">
  <tr>
    <th class="border border-black px-2 py-1 text-left">No</th>
    <th class="border border-black px-2 py-1 text-center">Description</th>
    <th class="border border-black px-2 py-1 text-center">Discount (%)</th>
    <th class="border border-black px-2 py-1 text-center">Amount (USD)</th>
  </tr>
</thead>
<tbody>
  ${data.items
    .map(
      (item, i) => `
    <tr>
      <td class="border border-black px-2 py-1 text-center">${i + 1}</td>
      <td class="border border-black px-2 py-1">${item.description}</td>
      <td class="border border-black px-2 py-1 text-center">${
        item.discount
      }</td>
      <td class="border border-black px-2 py-1 text-right">$${Number(
        item.amount
      ).toFixed(2)}</td>
    </tr>`
    )
    .join("")}
</tbody>
<tfoot>
  <tr class="bg-gray-50 font-semibold">
    <td colspan="3" class="border border-black px-2 py-1 text-right">Total Amount (USD)</td>
    <td class="border border-black px-2 py-1 text-right">
      ${data.items.reduce((s, i) => s + i.amount, 0).toFixed(2)}
    </td>
  </tr>
</tfoot>
  </table>

  <div class="mt-4">
    <p class="font-semibold">Remark:</p>
    <p class="text-red-500">${data.schoolInfo.remark}</p>
  </div>

  <div class="mt-4">
    <p class="font-semibold">Signature:</p>
    <img src="${data.schoolInfo.signatureUrl}" alt="Signature" class="w-32 h-auto mb-2" />
  </div>


  <p class="text-center text-xs text-black mt-6">
    ${data.schoolInfo.slogan}
  </p>
</body>
</html>`;
}

export async function openInvoicePrint(html: string): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    iframe.srcdoc = html;
  });

  await new Promise((r) => setTimeout(r, 100));

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  setTimeout(() => {
    try {
      document.body.removeChild(iframe);
    } catch {}
  }, 500);
}
