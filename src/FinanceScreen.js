import './App.css';
import TransactionList from "./components/TransactionList"
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import AddItem from './components/AddItem';
import EditItem from './components/EditItem';
import { Spin, Typography } from 'antd';
import axios from 'axios'

const URL_TXACTIONS = '/api/txactions'

function FinanceScreen() {
  const [summaryAmount, setSummaryAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const [transactionData, setTransactionData] = useState([])

  const [currentEditItem, setCurrenteditItem] = useState(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(URL_TXACTIONS)
      setTransactionData(response.data.data.map(row => ({
        id: row.id,
        key: row.id,
        ...row.attributes
      })))
    } catch (err) {
      console.log(err)
    } finally { 
      setIsLoading(false);
    }
  };

  const handleAddItem = async (item) => {
    try {
      setIsLoading(true)
      const params = { ...item, action_datetime: dayjs() }
      const response = await axios.post(URL_TXACTIONS, { data: params })
      const { id, attributes } = response.data.data
      setTransactionData([
        ...transactionData,
        { id: id, key: id, ...attributes }
      ])
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNoteChanged = (id, note) => {
    setTransactionData(
      transactionData.map(transaction => {
        transaction.note = transaction.id === id ? note : transaction.note;
        return transaction
      })
    )
  }

  const handleRowDeleted = async (id) => {
    try {
      setIsLoading(true)
      await axios.delete(`${URL_TXACTIONS}/${id}`)
      fetchItems()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  };

  const handleEditItem =(updatedItemitem) => {
    updateItem(updatedItemitem);
  };
    
  

  const updateItem = async (item) => {
    try{
      setIsLoading(true);
      await axios.put(`${URL_TXACTIONS}/${item.id}`, { data: item });
      setTransactionData(
        transactionData.map(transaction =>
          transaction.id === item.id ? {...transaction, ...item} : transaction
        )
      );
      setCurrenteditItem(null);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    setSummaryAmount(transactionData.reduce(
      (sum, transaction) => (
        transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount
      ), 0)
    )
  }, [transactionData])

  return (
    <div className="App">
      <header className="App-header">
        <Spin spinning={isLoading}>
          <Typography.Title>
            จำนวนเงินปัจจุบัน {summaryAmount} บาท
          </Typography.Title>

          <AddItem onItemAdded={handleAddItem} />
          <Divider>บันทึก รายรับ - รายจ่าย</Divider>
          <TransactionList
            data={transactionData}
            onRowEdit={handleEditItem}
            onNoteChanged={handleNoteChanged}
            onRowDeleted={handleRowDeleted} 
          />
        </Spin>
        {currentEditItem && (
          <EditItem
            isOpen={!!currentEditItem}
            item={currentEditItem}
            onItemedited={updateItem}
            oncancel={() => setCurrenteditItem(null)}
          />
        )}
      </header>
    </div>
  );
}

export default FinanceScreen;
