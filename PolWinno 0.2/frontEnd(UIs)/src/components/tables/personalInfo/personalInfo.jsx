import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearPerson, getPerson } from '../../../action/personal';
import AddModal from './AddModal';
import EditModal from './EditModal';

const PersonalInfo = () => {
    

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPerson());
    }, []);


    const persons = useSelector(state => state.persons);

    const [currentPerson, setCurrentPerson] = useState('');

    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    
    const openAddModal = () => {
        setAddModalIsOpen(true);
    };
    const openEditModal = (id) => {
        setEditModalIsOpen(true);
        setCurrentPerson(id);
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
                            جدول اشخاص 
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
                                Person = {currentPerson}
                            />


                        </div>
                    </div>

                    <div className="row">
                        <table className="table">
                            <thead>
                                <tr>

                                    <th scope="col">حذف</th>
                                    <th scope="col">ویرایش </th>
                                    <th scope="col"> ماهيت شخص </th>
                                    <th scope="col">جنسيت </th>
                                    <th scope="col">محل تولد </th>
                                    <th scope="col">تاريخ تولد </th>
                                    <th scope="col"> شماره شناسنامه</th>
                                    <th scope="col"> کدملي </th>
                                    <th scope="col"> نام خانوادگي</th>
                                    <th scope="col">نام  </th>

                                </tr>
                            </thead>
                            <tbody>
                                {persons.map((person) => (

                                    <tr key={person.PersonId}>

                                        <td>
                                            <button  utton className="tdbutton" onClick={() => dispatch(clearPerson(person.PersonId))} > 
                                                <span className="tblIcon" ><i className="far fa-times-circle"></i></span>
                                            </button>
                                        </td>
                                        <td>
                                            <button className="tdbutton" onClick={() => openEditModal(person) } > 
                                                <span className="tblIcon" ><i className="far fa-edit"></i></span>
                                            </button>
                                        </td>

                                        <td>{person.PersonType === 1 ?  "خیر" : person.PersonType === 2 ?  "کارمند" : "نیازمند" }</td>
                                        <td>{ person.Sex ? 'زن' : 'مرد' }</td>
                                        <td>{person.BirthPlace}</td>
                                        <td>{person.BirthDate}</td>
                                        <td>{person.IdNumber}</td>
                                        <td>{person.NationalCode}</td>
                                        <td>{person.Family}</td>
                                        <td>{person.Name}</td>
                                        

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
 
export default PersonalInfo;