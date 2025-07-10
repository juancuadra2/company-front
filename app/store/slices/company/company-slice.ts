import { createSlice } from '@reduxjs/toolkit';
import { type Company } from "./thunk";

const initialState: {
    companies: Company[];
    currentCompany: Company | null;
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    searchTerm: string;
} = {
    companies: [],
    currentCompany: null,
    isLoading: false,
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    searchTerm: '',
};

export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        startLoadingCompanies: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        setCompanies: (state, action) => {
            state.isLoading = false;
            state.companies = action.payload.data;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;
            state.pageSize = action.payload.pageSize;
        },
        setCurrentCompany: (state, action) => {
            state.isLoading = false;
            state.currentCompany = action.payload;
        },
        addCompany: (state, action) => {
            state.isLoading = false;
            state.companies.push(action.payload);
        },
        updateCompanyInList: (state, action) => {
            state.isLoading = false;
            const index = state.companies.findIndex(company => company.id === action.payload.id);
            if (index !== -1) {
                state.companies[index] = action.payload;
            }
            if (state.currentCompany?.id === action.payload.id) {
                state.currentCompany = action.payload;
            }
        },
        removeCompany: (state, action) => {
            state.isLoading = false;
            state.companies = state.companies.filter(company => company.id !== action.payload);
            if (state.currentCompany?.id === action.payload) {
                state.currentCompany = null;
            }
        },
        setError: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentCompany: (state) => {
            state.currentCompany = null;
        },
        resetCompanyState: (state) => {
            return initialState;
        }
    }
});

export const { 
    startLoadingCompanies,
    setCompanies,
    setCurrentCompany,
    addCompany,
    updateCompanyInList,
    removeCompany,
    setError,
    setSearchTerm, 
    clearError, 
    clearCurrentCompany, 
    resetCompanyState 
} = companySlice.actions;

export default companySlice.reducer;
