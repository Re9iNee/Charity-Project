import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { createCharityAcc } from '../../../action/charityAcc';
import { toast } from 'react-toastify';
import ComboBox from 'react-responsive-combo-box';




const AddModal = ({showMoldal , closeMoldal , baseData}) => {

    const [BankID , setBankID] = useState("");
    const [BranchName , setBranchName] = useState("");
    const [OwnerName , setOwnerName] = useState("");
    const [CardNumber , setCardNumber] = useState("");
    const [AccountNumber , setAccountNumber] = useState("");
    const [AccountName , setAccountName] = useState("");

    const data =[ 'بانک ملت 1' , 'بانک ملت 2' ];


    const dispatch = useDispatch();

    
    const resetState = () => {
        setBankID('');
        setBranchName('');
        setOwnerName('');
        setCardNumber('');
        setAccountNumber('');
        setAccountName('');
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        

        let charityAcc = {BankID , BranchName , OwnerName , CardNumber , AccountNumber , AccountName};

        try {

            dispatch(createCharityAcc(charityAcc));
            
            resetState();

        } catch (err) {
            toast.error("رکورد جدید ساخته نشد", {
                position: "bottom-right",
                closeOnClick: true
            });
            console.log(err);
        }
    };


    return ( 


        <Modal isOpen={showMoldal} onRequestClose={closeMoldal} appElement={document.getElementById('root')} 
        style={{
            overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                zIndex: 1000
            },
            content: {
                position: 'absolute',
                top: '50px',
                left: '150px',
                right: '150px',
                bottom: '50px',
                border: '1px solid #ccc',
                background: '#fff',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '5px',
                outline: 'none',
                padding: '20px'
            }
        }}>
            <div className="tableModal">
                <form onSubmit={handleSubmit} id="Form" >
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="نام شعبه" required value={BranchName}
                                onChange={e => setBranchName(e.target.value) } />
                        </div>
                        <div className="col-md-6">
                            <ComboBox style={{width : "100%"}} placeholder='نام بانک' options={data} required enableAutocomplete value={BankID}
                                onSelect={(option) => 
                                    {if(option === 'بانک ملت 1') {
                                        setBankID(baseData[0].CommonBaseDataId) 
                                        }else{
                                        setBankID(baseData[1].CommonBaseDataId) 
                                        }
                                    }} 
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="نام صاحب حساب" required value={OwnerName}
                                onChange={e => setOwnerName(e.target.value) } />
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="شماره کارت" value={CardNumber}
                                onChange={e => setCardNumber(e.target.value) } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="شماره حساب" required value={AccountNumber}
                                onChange={e => setAccountNumber(e.target.value) } />
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="نام حساب" value={AccountName}
                                onChange={e => setAccountName(e.target.value) } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <button className="btn" type="submit" form="Form" value="Submit">ثبت</button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn" onClick={closeMoldal} >خروج</button>
                        </div>
                    </div>
                </form>
            </div>

        </Modal>
    );
}
 
export default AddModal;

