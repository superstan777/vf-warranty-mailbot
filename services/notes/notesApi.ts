import axios from "axios";

export interface AddNotePayload {
  user_name: string;
  content: string;
  inc_number: string;
  origin: "mail";
}

export interface AddNoteResponse {
  success: boolean;
  data?: any;
  errorCode?: string;
  message: string;
  error?: any;
}

export async function addNote(
  payload: AddNotePayload
): Promise<AddNoteResponse> {
  try {
    const response = await axios.post<AddNoteResponse>(
      `${process.env.BACKEND_URL}/api/add-note-new`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BACKEND_SECRET}`,
        },
      }
    );

    return response.data;
  } catch (err: any) {
    const backendError = err.response?.data;

    return {
      success: false,
      message: backendError?.message ?? "Network or internal server error.",
      errorCode: backendError?.errorCode ?? "NETWORK_OR_INTERNAL_ERROR",
      error: backendError || err.message,
    };
  }
}

// export async function addOutlookAttachment(mailId: string, attachment: any) {
//   try {
//     const res = await axios.post(`${API_BASE_URL}/api/add-outlook-attachment`, {
//       mailId,
//       attachment,
//     });
//     return res.data;
//   } catch (err: any) {
//     console.error("Failed to add attachment:", err.response?.data || err);
//     throw err;
//   }
// }
