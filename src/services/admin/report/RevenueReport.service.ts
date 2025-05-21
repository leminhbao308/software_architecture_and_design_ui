import axios from "axios";
import APIConst from "../../../consts/APIConst";
import { ExportDataType } from "../../../components/popups/RevenueReportModal";

const RevenueReportService = {
  exportPDFReport: async (access_token: string, data: ExportDataType) => {
    try {
      console.log("Sending report data to server");

      const response = await axios.post(
        `${APIConst.API_CONTEXT}${APIConst.EXPORT_REVENUE_REPORT}`,
        data,
        {
          responseType: "blob", // Quan trọng: yêu cầu response dạng blob
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Trả về blob data
    } catch (err) {
      console.error("Export PDF failed: ", err);
      throw err; // Ném lỗi để component xử lý
    }
  },
};

export default RevenueReportService;
