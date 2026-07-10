import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

// ================= TYPES =================
interface Attendance {
  id: number;
  employeeId: number;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  date: string;
}

interface AttendanceState {
  list: Attendance[];
  single: Attendance | null;
  loading: boolean;
  error: string | null;
}

// ================= INITIAL STATE =================
const initialState: AttendanceState = {
  list: [],
  single: null,
  loading: false,
  error: null,
};

// ================= THUNKS =================

// 🔹 Get all attendance
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/attendance');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// 🔹 Get one attendance
export const fetchAttendanceById = createAsyncThunk(
  'attendance/fetchOne',
  async (id: number, thunkAPI) => {
    try {
      const res = await api.get(`/attendance/${id}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// 🔹 Create attendance
export const createAttendance = createAsyncThunk(
  'attendance/create',
  async (data: any, thunkAPI) => {
    try {
      const res = await api.post('/attendance', data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// 🔹 Update attendance
export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, data }: { id: number; data: any }, thunkAPI) => {
    try {
      const res = await api.patch(`/attendance/${id}`, data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// 🔹 Delete attendance
export const deleteAttendance = createAsyncThunk(
  'attendance/delete',
  async (id: number, thunkAPI) => {
    try {
      await api.delete(`/attendance/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Error');
    }
  }
);

// ================= SLICE =================
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🔹 FETCH ALL
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 FETCH ONE
      .addCase(fetchAttendanceById.pending, (state) => {
      state.loading = true;
    })

      // 🔹 CREATE
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // 🔹 UPDATE
      .addCase(updateAttendance.fulfilled, (state, action) => {
        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // 🔹 DELETE
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a.id !== action.payload);
      });
  },
});

export default attendanceSlice.reducer;