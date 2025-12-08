// App.js (or main routing file)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import AppLayout from './components/AppLayout';
import DashboardPage from './components/DashboardPage';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import CreateBrokerForm from './components/CreateBrokerForm';
import BrokersTable from './components/BrokersTable';
import EditBrokerPage from './components/EditBrokerPage';
import CreateLoadPage from './components/CreateLoadPage';
import LoadsTable from './components/LoadsTable';
import EditLoadPage from './components/EditLoadPage';
import ReviewFormPage from './components/ReviewFormPage';
import ReviewsTable from './components/ReviewsTable';
import PageNotFound from './components/PageNotFound';
import Home from './components/Home';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* The parent route uses AppLayout and includes an Outlet */}
          <Route path='/' element={<Navigate to='/admin' replace />} />


          <Route path="/submit-review" element={<ReviewFormPage />} />

          <Route path='/login' element={<Login />} />

          <Route element={<ProtectedRoute />}>

            <Route path="/admin" element={<AppLayout />}>
              {/* Child routes appear in the AppLayout's Outlet */}
              <Route index element={<DashboardPage />} /> {/* Renders at "/" */}
              <Route path="brokers" element={<BrokersTable />} />
              <Route path="create-broker" element={<CreateBrokerForm />} />
              <Route path="brokers/edit/:id" element={<EditBrokerPage />} />
              <Route path="loads" element={<LoadsTable />} />
              <Route path="loads/create" element={<CreateLoadPage />} />
              <Route path="loads/edit/:id" element={<EditLoadPage />} />
              <Route path="reviews" element={<ReviewsTable />} />

            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
