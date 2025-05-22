import React, { useState } from "react";
import {
  Modal,
  DatePicker,
  Button,
  Typography,
  Table,
  Empty,
  Card,
  Row,
  Col,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { OrderType } from "../../types/order/OrderType";
import { formatPrice } from "../../utils/formatUtils";
import isBetween from "dayjs/plugin/isBetween";
import locale from "antd/es/date-picker/locale/vi_VN";
import RevenueReportService from "../../services/admin/report/RevenueReport.service";
import { getAccessToken } from "../../utils/tokenUtils";
import FormatCurrency from "../../utils/formatCurrency";

// Đăng ký plugin cho dayjs
dayjs.extend(isBetween);

const { Title, Text } = Typography;

export type ReportItem = {
  key: string;
  productName: string;
  quantity: number;
  revenue: number | string;
};
export interface ExportDataType {
  startDate: string;
  endDate: string;
  currentDate: string;
  totalRevenue: number | string;
  reportItems: ReportItem[];
}

interface Props {
  visible: boolean;
  orders: OrderType[];
  onClose: () => void;
}

const RevenueReportModal: React.FC<Props> = ({ visible, orders, onClose }) => {
  // Ngày hiện tại
  const today = dayjs();

  // Ngày bắt đầu và kết thúc, mặc định là today
  const [startDate, setStartDate] = useState<Dayjs>(today);
  const [endDate, setEndDate] = useState<Dayjs>(today);
  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [filtered, setFiltered] = useState<boolean>(false);
  const token = getAccessToken();

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date) {
      setEndDate(date);
    }
  };

  const handleStatistic = () => {
    // Lọc đơn hàng trong khoảng
    const filteredOrders = orders.filter((o) => {
      const created = dayjs(o.createdAt);
      return created.isBetween(
        startDate.startOf("day"),
        endDate.endOf("day"),
        undefined,
        "[]"
      );
    });

    // Tính tổng doanh thu tất cả đơn
    const totRev = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Gom nhóm sản phẩm theo số lượng
    const map = new Map<
      string,
      { productName: string; quantity: number; revenue: number }
    >();
    filteredOrders.forEach((o) => {
      o.items?.forEach((it) => {
        const existing = map.get(it.productId);
        if (existing) {
          existing.quantity += it.quantity;
          existing.revenue += it.totalPrice;
        } else {
          map.set(it.productId, {
            productName: it.productName,
            quantity: it.quantity,
            revenue: it.totalPrice,
          });
        }
      });
    });

    // Chuyển thành mảng và chọn 3 sản phẩm bán chạy nhất
    const items: ReportItem[] = Array.from(map.entries()).map(([key, v]) => ({
      key,
      productName: v.productName,
      quantity: v.quantity,
      revenue: FormatCurrency(v.revenue),
    }));
    items.sort((a, b) => b.quantity - a.quantity);
    const top3 = items.slice(0, 3);

    setReportData(top3);
    setTotalRevenue(totRev);
    setFiltered(true);
  };

  const handleExportData = async () => {
    const exportData: ExportDataType = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      currentDate: today.format("YYYY-MM-DD"),
      totalRevenue: FormatCurrency(totalRevenue),
      reportItems: reportData,
    };

    try {
      // Gọi service export PDF
      const pdfBlob = await RevenueReportService.exportPDFReport(
        token,
        exportData
      );

      // Tạo URL tạm thời từ blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Tạo thẻ a ẩn để trigger download
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = `revenue_report_${exportData.startDate}_to_${exportData.endDate}.pdf`;

      // Thêm vào DOM và click
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Dọn dẹp
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(pdfUrl); // Giải phóng bộ nhớ
      }, 100);
    } catch (error) {
      console.error("Export PDF failed:", error);
      // Hiển thị thông báo lỗi cho người dùng
      alert("Xuất báo cáo thất bại. Vui lòng thử lại sau.");
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "start" as const,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "center" as const,
    },
  ];

  return (
    <Modal
      title={<Title level={4}>Thống kê doanh thu</Title>}
      open={visible}
      onCancel={onClose}
      width={850}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="export"
          type="primary"
          onClick={handleExportData}
          disabled={!filtered || reportData.length === 0}
        >
          Xuất dữ liệu
        </Button>,
      ]}
    >
      <Row gutter={[12, 12]} align="middle" style={{ marginBottom: "20px" }}>
        <Col span={10}>
          <Text strong>Ngày bắt đầu:</Text>
          <DatePicker
            placeholder="Chọn ngày bắt đầu"
            style={{ width: "100%", marginTop: 8 }}
            locale={locale}
            onChange={handleStartDateChange}
            value={startDate}
            format="DD/MM/YYYY"
          />
        </Col>
        <Col span={10}>
          <Text strong>Ngày kết thúc:</Text>
          <DatePicker
            placeholder="Chọn ngày kết thúc"
            style={{ width: "100%", marginTop: 8 }}
            locale={locale}
            onChange={handleEndDateChange}
            value={endDate}
            format="DD/MM/YYYY"
          />
        </Col>
        <Col span={2}>
          <Button
            type="primary"
            onClick={handleStatistic}
            style={{ marginTop: 32 }}
          >
            Thống kê
          </Button>
        </Col>
      </Row>

      <Card>
        <Title
          level={3}
          style={{
            textAlign: "center",
            fontWeight: "bolder",
            fontSize: "34px",
          }}
        >
          Dev<span style={{ color: "#3452FF" }}>i</span>cer{" "}
          <span style={{ color: "#3452FF" }}>S</span>tore
        </Title>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          Gò Vấp - Hồ Chí Minh
        </Text>
        <Title
          level={1}
          style={{
            textAlign: "center",
            fontWeight: "bolder",
            fontSize: "36px",
          }}
        >
          Thống Kê Doanh Thu
        </Title>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          {startDate.format("DD/MM/YYYY")} - {endDate.format("DD/MM/YYYY")}
        </Text>
        <Text
          style={{
            marginTop: 16,
            marginBottom: 10,
            display: "block",
            fontSize: "16px",
          }}
        >
          <span
            style={{
              fontWeight: "bolder",
              fontSize: "16px",
            }}
          >
            Doanh thu:
          </span>{" "}
          {formatPrice(totalRevenue)}
        </Text>
        <Text
          style={{
            marginBottom: 16,
            display: "block",
            fontWeight: "bolder",
            fontSize: "16px",
          }}
        >
          Top sản phẩm bán chạy:
        </Text>
        {filtered && reportData.length > 0 ? (
          <Table
            dataSource={reportData}
            columns={columns}
            pagination={false}
            size="small"
          />
        ) : filtered && reportData.length === 0 ? (
          <Empty description="Không có dữ liệu" />
        ) : (
          <Table
            dataSource={[]}
            columns={columns}
            pagination={false}
            locale={{ emptyText: <Empty /> }}
            size="small"
          />
        )}
        <Text style={{ display: "block", textAlign: "right", marginTop: 16 }}>
          Ngày {dayjs().format("DD [tháng] MM [năm] YYYY")}
        </Text>
      </Card>
    </Modal>
  );
};

export default RevenueReportModal;
