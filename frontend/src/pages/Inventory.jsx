import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Inventory = () => {
  const { serverURL } = useAuth();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [serial, setSerial] = useState('');
  const [ledger, setledger] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/items/get`);
        // Map backend fields to frontend fields
        const items = res.data.items.map((item) => ({
          id: item._id,
          name: item.itemname,
          price: item.price,
          quantity: item.quantity,
          createdAt: item.createdAt,
          serial: item.serial,
          ledger: item.ledger
        }));
        setInventoryItems(items);
      } catch (error) {
        console.error('Failed to fetch inventory items:', error);
      }
    };
    fetchItems();
  }, [serverURL]);

  const addOrUpdateInventoryItem = async (item) => {
    try {
      if (editId) {
        // Update
        const res = await axios.put(`${serverURL}/api/items/update/${editId}`, {
          itemname: item.name,
          price: item.price,
          quantity: item.quantity,
          serial: item.serial,
          ledger: item.ledger
        });

        setInventoryItems((prev) =>
          prev.map((it) =>
            it.id === editId
              ? {
                  ...it,
                  name: res.data.item.itemname,
                  price: res.data.item.price,
                  quantity: res.data.item.quantity,
                  serial: res.data.item.serial,
                  ledger: res.data.item.ledger
                }
              : it
          )
        );

        // ✅ Reset form after update
        setName('');
        setPrice('');
        setQuantity('');
        setSerial('');
        setledger('');
        setEditId(null);
        setShowForm(false);
      } else {
        // Add
        const res = await axios.post(`${serverURL}/api/items/create`, {
          itemname: item.name,
          price: item.price,
          quantity: item.quantity,
          serial: item.serial,
          ledger: item.ledger
        });

        setInventoryItems([
          ...inventoryItems,
          {
            id: res.data.item._id,
            name: res.data.item.itemname,
            price: res.data.item.price,
            quantity: res.data.item.quantity,
            createdAt: res.data.item.createdAt,
            serial: res.data.item.serial,
            ledger: res.data.item.ledger
          },
        ]);

        // ✅ Reset form after add
        setName('');
        setPrice('');
        setQuantity('');
        setSerial('');
        setledger('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to add/update inventory item:', error);
      alert('Failed to add/update item.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && price && quantity && serial && ledger) {
      addOrUpdateInventoryItem({
        name,
        price,
        quantity,
        serial,
        ledger
      });
    }
  };

  const handleEdit = (item) => {
    setName(item.name || '');
    setPrice(item.price || '');
    setQuantity(item.quantity || '');
    setSerial(item.serial || '');
    setledger(item.ledger || '');
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${serverURL}/api/items/delete/${id}`);
      setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
      alert('Failed to delete item.');
    }
  };

  return (
    <div className='left-66 relative top-10 mb-6 w-[calc(100vw-310px)] '>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setName('');
            setPrice('');
            setQuantity('');
            setSerial('');
            setledger('');
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <span className="mr-2 text-lg font-bold leading-none">+</span>
          {editId ? 'Edit Item' : 'Add Item'}
        </button>
      </div>

      {showForm && (
        <div className="mt-5 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {editId ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-700">Serial Number</label>
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="h-10 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 border-gray-300 rounded-md bg-gray-100"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-700">Item Description</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 border-gray-300 rounded-md bg-gray-100"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-10 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 border-gray-300 rounded-md bg-gray-100"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-10 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 border-gray-300 rounded-md bg-gray-100"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-sm font-medium text-gray-700">Ledger Head Number</label>
              <input
                type="text"
                value={ledger}
                onChange={(e) => setledger(e.target.value)}
                className="h-10 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 border-gray-300 rounded-md bg-gray-100"
                required
              />
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setName('');
                  setPrice('');
                  setQuantity('');
                  setSerial('');
                  setledger('');
                }}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-12 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="table-fixed w-full divide-y divide-gray-300">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
        Issue Slip No
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
        Date
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
        Item Description
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
        Quantity
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
        Price
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
        Ledger Head
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
        Actions
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {inventoryItems.length > 0 ? (
      inventoryItems.map((item) => (
        <tr key={item.id}>
          <td className="px-4 py-4 text-sm text-gray-500 break-words whitespace-normal">
            {item.serial}
          </td>
          <td className="px-4 py-4 text-sm text-gray-500 break-words whitespace-normal">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
          </td>
          <td className="px-4 py-4 text-sm text-gray-900 break-words whitespace-normal">
            {item.name}
          </td>
          <td className="px-4 py-4 text-sm text-gray-500 break-words whitespace-normal">
            {item.quantity}
          </td>
          <td className="px-4 py-4 text-sm text-gray-500 break-words whitespace-normal">
            {item.price}
          </td>
          <td className="px-4 py-4 text-sm text-gray-500 break-words whitespace-normal">
            {item.ledger}
          </td>
          <td className="px-4 py-4 text-sm flex gap-4">
            <button
              className="text-blue-600 hover:text-blue-900"
              onClick={() => handleEdit(item)}
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              onClick={() => handleDelete(item.id)}
              title="Delete"
            >
              <FaTrash />
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td
          colSpan={7}
          className="px-4 py-4 text-sm text-gray-500 text-center"
        >
          No inventory items yet
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default Inventory;
