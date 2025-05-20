import axios from "axios";
import APIConst from "../../../consts/APIConst";
import { ExportDataType } from "../../../components/popups/RevenueReportModal";

const RevenueReportService = {
  exportPDFReport: async (access_token: string, data: ExportDataType) => {
    try {
      const response = await axios.post(
        `${APIConst.API_CONTEXT}${APIConst.EXPORT_REVENUE_REPORT}`,
        // "http://localhost:8386/api/v1/report/export-pdf",
        data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err) {
      console.log("Export PDF is failed: ", err);
      return null;
    }
  },
};

export default RevenueReportService;
