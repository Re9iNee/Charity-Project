import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearBaseType , getBaseType } from '../../../action/cmnBaseType';
import AddModal from './AddModal';
import EditModal from './EditModal';



const CommonBaseType = () => {



    const dispatch = useDispatch();
    
    useEffect( () => {
        dispatch(getBaseType())
    } , [] );
    
    
    const baseTypes = useSelector(state => state.baseType);

    const [currentBaseType , setCurrentBaseType] = useState('');

    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    const openAddModal = () => {
        setAddModalIsOpen(true);
    };
    const openEditModal = (id) => {
        setEditModalIsOpen(true);
        setCurrentBaseType(id);
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
                            جدول فرم شناسه ثابت
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-md-4 inline-block">
                            <div className="text-center ml-4">
                                <button className="btn tableBtn" onClick={openAddModal} >
                                    <span className="fa fa-plus"></span>
                                    اضافه کردن
                                </button>
                            </div>

                            <AddModal 
                                showMoldal = {addModalIsOpen}
                                closeMoldal = {closeAddModal}
                            />

                            
                            <EditModal 
                                showMoldal = {editModalIsOpen}
                                closeMoldal = {closeEditModal}
                                baseType = {currentBaseType}
                            />

                        </div>
                    </div>
                    <div className="row">

                        

                        <table className="table">
                            <thead>
                                <tr>

                                    <th scope="col"></th>
                                    <th scope="col">حذف</th>
                                    <th scope="col">ویرایش </th>

                                    <th scope="col">عنوان</th>
                                    
                                    <th scope="col">کد
                                        {/* <span className="fa fa-long-arrow-up" style={{ marginLeft: "0.5em", cursor: "pointer" }}></span>
                                        <span className="fa fa-long-arrow-down" style={{ marginLeft: "0.5em", cursor: "pointer" }}></span> */}
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {baseTypes.map((baseType) => (

                                <tr key={baseType.CommonBaseTypeId}>

                                    <td></td>

                                    <td>
                                        <button className="tdbutton" onClick={() => dispatch(clearBaseType(baseType.CommonBaseTypeId)) }> 
                                            <span className="tblIcon" ><i className="far fa-times-circle"></i></span>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="tdbutton" onClick={() => openEditModal(baseType) }> 
                                            <span className="tblIcon" ><i className="far fa-edit"></i></span>
                                        </button>
                                    </td>

                                    <td>{baseType.BaseTypeTitle}</td>

                                    <td>{baseType.BaseTypeCode}</td>

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
 
export default CommonBaseType;