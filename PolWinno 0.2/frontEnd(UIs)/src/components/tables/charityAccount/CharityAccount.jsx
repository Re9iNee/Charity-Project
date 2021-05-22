import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {clearCharityAccount, getCharityAcc} from '../../../action/charityAcc';
import { getBaseData } from '../../../action/cmnBaseData';
import AddModal from './AddModal';
import EditModal from './EditModal';

const CharityAccount = () => {


    const dispatch = useDispatch();
    
    useEffect( () => {
        dispatch(getCharityAcc());
        dispatch(getBaseData());
    } , [] );
    
   
    const charityAccounts = useSelector(state => state.charityAccount);
    const baseData = useSelector(state => state.baseData);
    
    const [currentCharityAcc, setCurrentCharityAcc] = useState('');

    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    const openAddModal = () => {
        setAddModalIsOpen(true);
    };
    const openEditModal = (id) => {
        setEditModalIsOpen(true);
        setCurrentCharityAcc(id);
    };
    
    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };
    const closeEditModal = () => {
        setEditModalIsOpen(false);
    };



    return ( 

        <section style={{ marginTop: "5em", padding: "0 20px" }}>
            <div >
                <div>
                    <div className="row">
                        <h3 className="tableTitle text-center">
                            جدول حساب های خیریه
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-md-4 inline-block">
                            <div className="text-center ml-4">
                                <button className="btn tableBtn" onClick={openAddModal}  >
                                    <span className="fa fa-plus"></span>
                                    اضافه کردن
                                </button>
                            </div>

                            <AddModal 
                                showMoldal = {addModalIsOpen}
                                closeMoldal = {closeAddModal}
                                baseData = {baseData}
                            />

                            <EditModal 
                                showMoldal = {editModalIsOpen}
                                closeMoldal = {closeEditModal}
                                baseData = {baseData}
                                charityAccount = {currentCharityAcc}
                            />

                            

                        </div>
                    </div>

                    <div className="row">

                        <table className="table">
                            <thead>
                                <tr>

                                    <th scope="col">حذف</th>
                                    <th scope="col">ویرایش </th>
                                    <th scope="col">نام حساب</th>
                                    <th scope="col">شماره حساب</th>
                                    <th scope="col">شماره کارت</th>
                                    <th scope="col">نام صاحب حساب</th>
                                    <th scope="col">نام شعبه </th>

                                </tr>
                            </thead>
                            <tbody>
                                {charityAccounts.map((charityAccount) => (

                                    <tr key={charityAccount.CharityAccountId}>

                                        <td>
                                            <button className="tdbutton" onClick={() => dispatch(clearCharityAccount(charityAccount.CharityAccountId))} > 
                                                <span className="tblIcon" ><i className="far fa-times-circle"></i></span>
                                            </button>
                                        </td>
                                        <td>
                                            <button className="tdbutton" onClick={() => openEditModal(charityAccount) } > 
                                                <span className="tblIcon" ><i className="far fa-edit"></i></span>
                                            </button>
                                        </td>

                                        <td>{charityAccount.AccountName}</td>
                                        <td>{charityAccount.AccountNumber}</td>
                                        <td>{charityAccount.CardNumber}</td>
                                        <td>{charityAccount.OwnerName}</td>
                                        <td>{charityAccount.BranchName}</td>

                                    </tr>
                                ))}
                            
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>

     );
}
 
export default CharityAccount;