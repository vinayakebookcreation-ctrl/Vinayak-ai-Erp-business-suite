# 🚀 Vinayak AI Business Suite

**Enterprise-grade ERP & Business Automation Platform for Indian SMBs**

Vinayak AI Business Suite is a modern, scalable ERP application built with **Next.js 16, TypeScript, Tailwind CSS, and Supabase**. It is designed specifically for Indian small and medium businesses with support for **GST-ready invoicing, inventory management, analytics, and role-based access control (RBAC)**.

---

## ✨ Key Features

### 🔐 Authentication & Security

* Supabase Authentication
* Secure session handling
* Route protection
* Role-Based Access Control (RBAC)

### 🏢 Company Management

* Multi-company support
* Branch management
* Company profile & GST details

### 👥 Employee Management

* Employee master records
* Department & designation support
* Active/inactive status tracking

### 📦 Inventory Management

* Product master
* Stock tracking
* Low stock alerts
* Inventory valuation

### 🛒 Purchase Management

* Purchase orders
* Supplier tracking
* Purchase analytics

### 🧾 Sales & Invoicing

* GST-ready sales invoices
* PDF invoice generation
* Invoice printing
* Customer management

### 📊 Analytics Dashboard

* Monthly sales chart
* Monthly purchase chart
* Real-time business KPIs
* Low stock monitoring

---

## 🖼️ Screenshots

> Add screenshots inside `/public/screenshots/`

* Dashboard
* Reports Dashboard
* Sales Invoice
* Inventory Module
* RBAC Permissions

---

## 🛠️ Tech Stack

| Layer         | Technology      |
| ------------- | --------------- |
| Frontend      | Next.js 16      |
| Language      | TypeScript      |
| Styling       | Tailwind CSS    |
| UI Components | shadcn/ui       |
| Backend       | Supabase        |
| Database      | PostgreSQL      |
| Charts        | Recharts        |
| Forms         | React Hook Form |
| Validation    | Zod             |
| Icons         | Lucide React    |

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   └── (dashboard)/
├── components/
│   ├── charts/
│   ├── dashboard/
│   ├── layout/
│   └── ui/
├── features/
│   ├── auth/
│   ├── company/
│   ├── branch/
│   ├── employee/
│   ├── inventory/
│   ├── purchase/
│   ├── sales/
│   └── reports/
└── lib/
    └── supabase/
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/vinayak-ai-business-suite.git
cd vinayak-ai-business-suite
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## 🗄️ Database Setup

Run migration files in order:

```text
001_initial_schema.sql
002_company_branch.sql
003_employee.sql
004_supplier_customer.sql
005_inventory.sql
006_purchase.sql
007_sales.sql
```

These migrations create:

* Companies
* Branches
* Profiles
* Employees
* Suppliers
* Customers
* Products
* Purchase Orders
* Sales Invoices
* Invoice Items

---

## 🔐 RBAC Modules

| Module    | View | Create | Update | Delete |
| --------- | ---- | ------ | ------ | ------ |
| Dashboard | ✅    | —      | —      | —      |
| Company   | ✅    | ✅      | ✅      | ✅      |
| Branch    | ✅    | ✅      | ✅      | ✅      |
| Employee  | ✅    | ✅      | ✅      | ✅      |
| Inventory | ✅    | ✅      | ✅      | ✅      |
| Purchase  | ✅    | ✅      | ✅      | ✅      |
| Sales     | ✅    | ✅      | ✅      | ✅      |
| Reports   | ✅    | —      | —      | —      |

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## 📈 Current Release

### **v1.2.0 — Stable Analytics Release**

#### Added

* Reports Dashboard
* Sales Chart
* Purchase Chart
* Low Stock Alert
* Dashboard summary analytics
* Inventory valuation service

#### Improved

* Type-safe ReportsService
* Better Supabase error handling
* Responsive analytics layout

See [CHANGELOG.md](./CHANGELOG.md) for complete release history.

---

## 🧪 Production Checklist

* [ ] Enable Supabase Row Level Security (RLS)
* [ ] Configure custom domain
* [ ] Add SMTP/email provider
* [ ] Enable audit logging
* [ ] Configure automated database backups
* [ ] Add monitoring (Sentry / LogRocket)
* [ ] Add CI/CD pipeline

---

## ☁️ Deployment

### Deploy to Vercel

```bash
npm run build
```

Set environment variables in the Vercel dashboard and deploy.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Kautik Nai**
Full-Stack Developer & Business Automation Expert
📍 Vadodara, Gujarat, India

* GitHub: https://github.com/your-username
* LinkedIn: https://linkedin.com/in/kautik-nai
* Email: [your-email@example.com](mailto:your-email@example.com)

---

## ⭐ Support the Project

If you find this project useful, please consider giving it a **GitHub star ⭐** and sharing it with other developers.
