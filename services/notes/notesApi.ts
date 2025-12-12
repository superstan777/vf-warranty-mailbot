import axios from "axios";

export interface AttachmentFullPayload {
  graph_id: string;
  file_name: string;
  content_base_64: string;
  content_type?: string;
}

export interface AddNotePayload {
  user_name: string;
  content: string;
  inc_number: string;
  origin: "mail";
  graph_id: string;
  attachments?: AttachmentFullPayload[];
}

export interface AddNoteResponse {
  success: boolean;
  message: string;
  data?: any;
  errorCode?: string;
  error?: any;
}

export async function addNoteWithAttachments(
  payload: AddNotePayload
): Promise<AddNoteResponse> {
  try {
    const response = await axios.post<AddNoteResponse>(
      `${process.env.BACKEND_URL}/api/notes/process-mail`,
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
      error: err.response?.data?.error ?? err.message,
    };
  }
}
