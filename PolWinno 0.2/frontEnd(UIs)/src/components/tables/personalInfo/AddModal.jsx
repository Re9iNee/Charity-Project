import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { createPerson } from '../../../action/personal';




const AddModal = ({showMoldal , closeMoldal }) => {

    const [Name , setName] = useState("");
    const [Family , setFamily] = useState("");
    const [NationalCode , setNationalCode] = useState("");
    const [IdNumber , setIdNumber] = useState("");
    const [BirthDate , setBirthDate] = useState("");
    const [BirthPlace , setBirthPlace] = useState("");
    const [Sex , setSex] = useState(false);
    const [PersonType , setPersonType] = useState(1);

    const dispatch = useDispatch();

    
    const resetState = () => {
        setName('');
        setFamily('');
        setNationalCode('');
        setIdNumber('');
        setBirthDate('');
        setBirthPlace('');
        setSex();
        setPersonType();
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        let person = new FormData()

        person.append("Name" , Name);
        person.append("Family" , Family);
        person.append("NationalCode" , NationalCode);
        person.append("IdNumber" , IdNumber);
        person.append("BirthDate" , BirthDate);
        person.append("BirthPlace" , BirthPlace);
        person.append("Sex" , Sex);
        person.append("PersonType" , PersonType);
        person.append("imageUrl" , event.target.imageUrl.files[0]);
        
        try {
            dispatch(createPerson(person));
            
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
                            <input type="text" className="form-control" placeholder="نام خانوادگي" name="Family" value={Family}
                                onChange={e => setFamily(e.target.value) } />
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="نام " name="Name" value={Name}
                                onChange={e => setName(e.target.value) } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="شماره شناسنامه" name="IdNumber" value={IdNumber}
                                onChange={e => setIdNumber(e.target.value) } />
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="کدملي " name="NationalCode" value={NationalCode}
                                onChange={e => setNationalCode(e.target.value) } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="محل تولد" name="BirthPlace" value={BirthPlace}
                                onChange={e => setBirthPlace(e.target.value) } />
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="تاريخ تولد" name="BirthDate" value={BirthDate}
                                onChange={e => setBirthDate(e.target.value) } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group cashRadio" style={{marginTop:"30px"}}>
                                <label>جنسيت : </label>
                                <div>
                                    <label className="radio-container">زن
                                        <input type="radio" name="Sex" 
                                            onChange={e => setSex(e.currentTarget.checked)} />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="radio-container"> مرد
                                        <input type="radio"  />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="form-group " >
                                <label className="cashRadio">ماهيت شخص</label>
                                <select className="form-control" name="PersonType" value={PersonType} 
                                    onChange={e => setPersonType(e.target.value)} >
                                    <option value="1" >خیر</option>
                                    <option value="2" >کارمند</option>
                                    <option value="3" >نیازمند</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-12">
                            <label className="iconpic" htmlFor="file"> عکس را وارد کنید
                                <input className="input-style" type="file" name="imageUrl" />
                            </label>
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

