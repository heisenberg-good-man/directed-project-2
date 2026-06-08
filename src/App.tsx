import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import FreightList from '@/pages/freight/List';
import FreightForm from '@/pages/freight/Form';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/freight" element={<FreightList />} />
          <Route path="/freight/new" element={<FreightForm />} />
          <Route path="/freight/:id/edit" element={<FreightForm />} />
        </Route>
        <Route path="*" element={<div className="text-center text-xl py-20">404 - 页面不存在</div>} />
      </Routes>
    </Router>
  );
}
