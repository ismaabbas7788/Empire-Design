import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "../AnalyticsPage.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

Modal.setAppElement('#root');

const AnalyticsPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [salesSummary, setSalesSummary] = useState({});
  const [loadingReport, setLoadingReport] = useState(false);

  // New sales data states
  const [salesData, setSalesData] = useState([]);
  const [salesTotal, setSalesTotal] = useState(0);
  const [salesPage, setSalesPage] = useState(1);
  const salesLimit = 20;
  const [salesStartDate, setSalesStartDate] = useState(null);
  const [salesEndDate, setSalesEndDate] = useState(null);
  const [salesLoading, setSalesLoading] = useState(false);
  //sales by product 
  const [salesByProduct, setSalesByProduct] = useState([]);
  //sales by category
   const [modalCategoryName, setModalCategoryName] = useState("");
  const [modalCategoryDetails, setModalCategoryDetails] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // ✅ Safer category modal function
  const openCategoryModal = async (categoryId, categoryName) => {
    if (!categoryId) {
      console.error("No categoryId provided, cannot open modal.");
      return;
    }

  setModalCategoryName(categoryName);
  setModalLoading(true);
  setIsCategoryModalOpen(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/analytics/category-details/${categoryId}`
      );
      if (!res.ok) throw new Error("Failed to fetch category details");

      const data = await res.json();
      setModalCategoryDetails(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setModalCategoryDetails([]);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
  const fetchSalesByProduct = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/analytics/sales-by-product", {
        params: {
          startDate: salesStartDate ? salesStartDate.toISOString().split("T")[0] : null,
          endDate: salesEndDate ? salesEndDate.toISOString().split("T")[0] : null,
        },
      });
      setSalesByProduct(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sales by product:", error);
    }
  };

  fetchSalesByProduct();
}, [salesStartDate, salesEndDate]);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/analytics/total-users"
        );
        setTotalUsers(response.data.totalUsers || response.data.total || 0);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    const fetchTotalOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/analytics/total-orders"
        );
        setTotalOrders(response.data.totalOrders || 0);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/analytics/total-revenue"
        );
        setTotalRevenue(response.data.revenue || 0);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    const fetchTopProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/analytics/top-products"
        );
        setTopProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };

    const fetchCategorySales = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/analytics/category-sales"
    );
    console.log("Category Sales API:", response.data.data);
    setCategorySales(response.data.data || []);
  } catch (error) {
    console.error("Error fetching category sales:", error);
  }
};

    const fetchSalesSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/analytics/sales-summary"
        );
        setSalesSummary(response.data || {});
      } catch (error) {
        console.error("Error fetching sales summary:", error);
      }
    };

    fetchTotalUsers();
    fetchTotalOrders();
    fetchTotalRevenue();
    fetchTopProducts();
    fetchCategorySales();
    fetchSalesSummary();
  }, []);

  // Fetch paginated sales data with date filter
  const fetchSalesData = async () => {
    setSalesLoading(true);
    try {
      let url = `http://localhost:5000/api/analytics/sales-data?page=${salesPage}&limit=${salesLimit}`;
      if (salesStartDate && salesEndDate) {
        url += `&startDate=${salesStartDate.toISOString().split("T")[0]}&endDate=${salesEndDate
          .toISOString()
          .split("T")[0]}`;
      }
      const response = await axios.get(url);
      setSalesData(response.data.data);
      setSalesTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
    setSalesLoading(false);
  };

  // Fetch sales data when page or dates change
  useEffect(() => {
    fetchSalesData();
  }, [salesPage, salesStartDate, salesEndDate]);

  const totalSalesPages = Math.ceil(salesTotal / salesLimit);

  const downloadUserReport = async () => {
    setLoadingReport(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/analytics/user-report",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_analytics_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download user report:", error);
      alert("Failed to download user report. Please try again later.");
    } finally {
      setLoadingReport(false);
    }
  };

  const downloadOrdersReport = async () => {
    setLoadingReport(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/analytics/orders-report",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download orders report:", error);
      alert("Failed to download orders report. Please try again later.");
    } finally {
      setLoadingReport(false);
    }
  };
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] === null || row[header] === undefined ? "" : row[header];
      return `"${val}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Download Sales by Product
const downloadSalesByProductReport = () => {
  exportToCSV(salesByProduct, "sales_by_product.csv");
};

// Download Sales by Category
const downloadSalesByCategoryReport = () => {
  exportToCSV(categorySales, "sales_by_category.csv");
};

// Download Sales Data
const downloadSalesDataReport = async () => {
  try {
    const params = { page: 1, limit: 99999 }; // big number for all rows

    // Only add date filter if both start & end dates are set
    if (salesStartDate && salesEndDate) {
      params.startDate = salesStartDate.toISOString().split("T")[0];
      params.endDate = salesEndDate.toISOString().split("T")[0];
    }

    const response = await axios.get(
      "http://localhost:5000/api/analytics/sales-data",
      { params }
    );

    exportToCSV(response.data.data, "sales_data.csv");
  } catch (error) {
    console.error("Error downloading sales data:", error);
    alert("Failed to download sales data");
  }
};

const downloadCategoryDetailsReport = () => {
  exportToCSV(modalCategoryDetails, `category_${modalCategoryName}_details.csv`);
};

  return (
    <div className="analytics-container">
      <h2 className="analytics-header">Analytics Dashboard</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-title">Total Users</div>
          <div className="analytics-value">{totalUsers}</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-title">Total Orders</div>
          <div className="analytics-value">{totalOrders}</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-title">Total Revenue</div>
          <div className="analytics-value">Rs. {totalRevenue}</div>
        </div>
      </div>

      {/* Sales Summary Table */}
      <h3 style={{ marginTop: "2rem", color: "#333" }}>Sales Summary</h3>
      <table
        style={{ borderCollapse: "collapse", width: "100%", marginTop: "1rem" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Metric</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              Total Sales
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {salesSummary.totalSales || 0}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              Number of Orders
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {salesSummary.totalOrders || 0}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              Average Order Value
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {salesSummary.averageOrderValue || 0}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              Highest Single Order
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {salesSummary.highestOrder || 0}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>Sales Today</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {salesSummary.todaySales || 0}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              Sales This Week
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {salesSummary.weekSales || 0}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              Sales This Month
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {salesSummary.monthSales || 0}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Report Buttons */}
      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={downloadUserReport}
          disabled={loadingReport}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loadingReport ? "not-allowed" : "pointer",
            marginRight: "10px",
          }}
        >
          {loadingReport
            ? "Downloading User Report..."
            : "Download User Analytics Report"}
        </button>

        <button
          onClick={downloadOrdersReport}
          disabled={loadingReport}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loadingReport ? "not-allowed" : "pointer",
          }}
        >
          {loadingReport
            ? "Downloading Orders Report..."
            : "Download Orders Report"}
        </button>
      </div>

      {/* Top Selling Products Chart */}
      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem", flexWrap: "wrap" }}>
  <div style={{ flex: "1 1 600px", minWidth: "300px" }}>
    <h3 style={{ color: "#333" }}>Top Selling Products</h3>
    <Bar
      data={{
        labels: topProducts.map((p) => p.name),
        datasets: [
          {
            label: "Sales",
            data: topProducts.map((p) => p.sales),
            backgroundColor: "rgba(37, 99, 235, 0.7)",
            borderColor: "rgba(37, 99, 235, 1)",
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
      }}
    />
  </div>

  {/* Sales By Product Table */}
  <div
    style={{
      flex: "1 1 400px",
      minWidth: "280px",
      maxHeight: "400px",
      overflowY: "auto",
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "10px",
      backgroundColor: "#fff",
    }}
  >
    <h3 style={{ color: "#333", marginBottom: "10px" }}>Sales by Product</h3>
    <button
    onClick={downloadSalesByProductReport}
    style={{
      marginright: "10px",
      padding: "5px 10px",
      backgroundColor: "#f59e0b",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Download CSV
  </button>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead style={{ backgroundColor: "#f3f4f6" }}>
        <tr>
          <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>
            Product
          </th>
          <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
            Quantity Sold
          </th>
          <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
            Total Revenue (Rs.)
          </th>
        </tr>
      </thead>
      <tbody>
        
        {salesByProduct.length === 0 ? (
          <tr>
            <td colSpan="3" style={{ textAlign: "center", padding: "8px" }}>
              No data found
            </td>
          </tr>
        ) : (
          salesByProduct.map((item) => (
            <tr key={item.productId}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.productName}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                {item.totalQuantity}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                {parseFloat(item.totalRevenue).toFixed(2)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

     {/* Category-wise Sales Section: Pie chart + Table side by side */}
<h3 style={{ marginTop: "2rem", color: "#333" }}>
  Category-wise Sales Breakdown
</h3>
<div
  style={{
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginTop: "1rem",
  }}
>
  {/* Pie Chart */}
  <div style={{ flex: "1 1 300px", maxWidth: "600px" }}>
    <Pie
      data={{
        labels: categorySales.map((item) => item.category),
        datasets: [
          {
            data: categorySales.map((item) => item.totalSales),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#F67019",
              "#00A5CF",
              "#FFA41B",
            ],
            hoverOffset: 10,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "right" },
          tooltip: { enabled: true },
        },
      }}
    />
  </div>

  {/* Category-wise Sales Table */}
  <div
    style={{
      flex: "1 1 300px",
      maxWidth: "400px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      backgroundColor: "#fff",
      padding: "10px",
      height: "fit-content",
    }}
  >
    <h3 style={{ color: "#333", marginBottom: "10px" }}>Sales by Category</h3>
    <button
    onClick={downloadSalesByCategoryReport}
    style={{
      marginright: "10px",
      padding: "5px 10px",
      backgroundColor: "#8b5cf6",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Download CSV
  </button>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead style={{ backgroundColor: "#f3f4f6" }}>
        <tr>
          <th
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              textAlign: "left",
              whiteSpace: "nowrap",
            }}
          >
            Category
          </th>
          <th
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              textAlign: "right",
              whiteSpace: "nowrap",
            }}
          >
            Total Sales (Rs.)
          </th>
        </tr>
      </thead>
      <tbody>
  {categorySales.length === 0 ? (
    <tr>
      <td colSpan="2" style={{ textAlign: "center", padding: "8px" }}>
        No data found
      </td>
    </tr>
  ) : (
    categorySales.map((item, index) => (
      <tr
        key={index}
        style={{ cursor: "pointer" }}
        onClick={() => openCategoryModal(item.categoryId, item.category)} // ⬅ ADD HERE
        title={`View details for ${item.category}`}
      >
        <td style={{ padding: "8px", border: "1px solid #ddd" }}>
          {item.category}
        </td>
        <td
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            textAlign: "right",
          }}
        >
          {parseFloat(item.totalSales).toFixed(2)}
        </td>
      </tr>
    ))
  )}
</tbody>
    </table>
  </div>
</div>
{/* 4️⃣ Modal at bottom */}
     <Modal
  isOpen={isCategoryModalOpen}
  onRequestClose={() => setIsCategoryModalOpen(false)}
  contentLabel="Category Details"
  style={{
    content: {
      maxWidth: "700px",
      margin: "auto",
      borderRadius: "8px",
      padding: "20px"
    }
  }}
>
  <h2>Category Details: {modalCategoryName}</h2>

  {modalLoading ? (
    <p>Loading...</p>
  ) : modalCategoryDetails.length === 0 ? (
    <p>No details found for this category.</p>
  ) : (
    <>
      {/* Download CSV button */}
      <button
        onClick={() =>
          exportToCSV(
            modalCategoryDetails,
            `category_${modalCategoryName}_details.csv`
          )
        }
        style={{
          marginBottom: "10px",
          padding: "6px 12px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Download CSV
      </button>

      {/* Category Details Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem"
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Product
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Subcategory
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Total Quantity Sold
            </th>
          </tr>
        </thead>
        <tbody>
          {modalCategoryDetails.map((item) => (
            <tr key={item.productId}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.productName}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.subcategoryName}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.totalQuantitySold}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )}
</Modal>


        {/* New Sales Data Table and Filters */}
      <h3 style={{ marginTop: "3rem", color: "#333" }}>Sales Data</h3>
      <button
    onClick={downloadSalesDataReport}
    style={{
      marginLeft: "10px",
      padding: "5px 10px",
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Download CSV
  </button>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="date"
          value={salesStartDate ? salesStartDate.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            setSalesPage(1);
            setSalesStartDate(e.target.value ? new Date(e.target.value) : null);
            // Reset end date if it is before start date
            if (
              salesEndDate &&
              e.target.value &&
              new Date(e.target.value) > salesEndDate
            ) {
              setSalesEndDate(null);
            }
          }}
          placeholder="Start Date"
          style={{ padding: "6px" }}
        />
        <input
          type="date"
          value={salesEndDate ? salesEndDate.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            setSalesPage(1);
            setSalesEndDate(e.target.value ? new Date(e.target.value) : null);
          }}
          min={salesStartDate ? salesStartDate.toISOString().split("T")[0] : ""}
          placeholder="End Date"
          style={{ padding: "6px" }}
        />
      </div>

      {salesLoading ? (
        <p>Loading sales data...</p>
      ) : (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginBottom: "1rem",
            border: "1px solid #ddd",
          }}
        >
          <thead style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
            <tr>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Order ID</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Order Date</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Customer</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Product</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Quantity</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Total Price</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {salesData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "8px" }}>
                  No sales data found
                </td>
              </tr>
            ) : (
              salesData.map((sale, i) => (
                <tr key={i}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {sale.order_id}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {sale.customerName}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {sale.productName}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {sale.quantity}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    Rs. {parseFloat(sale.total_price).toFixed(2)}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {sale.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setSalesPage((p) => Math.max(p - 1, 1))}
          disabled={salesPage === 1}
          style={{
            padding: "6px 12px",
            marginRight: "8px",
            cursor: salesPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <span>
          Page {salesPage} of {totalSalesPages || 1}
        </span>
        <button
          onClick={() => setSalesPage((p) => Math.min(p + 1, totalSalesPages))}
          disabled={salesPage === totalSalesPages || totalSalesPages === 0}
          style={{
            padding: "6px 12px",
            marginLeft: "8px",
            cursor:
              salesPage === totalSalesPages || totalSalesPages === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>      
);
};

export default AnalyticsPage;
