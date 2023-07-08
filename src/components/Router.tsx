import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/home';
import { Expense } from './pages/Expense';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/expense/:id" element={<Expense />} />
    </Routes>
  );
}