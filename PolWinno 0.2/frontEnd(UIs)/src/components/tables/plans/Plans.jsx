import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearPlan, getPlans } from '../../../action/plans';
import AddModal from './AddModal';
import EditModal from './EditModal';

const Plans = () => {


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPlans());
    }, []);


    const plans = useSelector(state => state.plans);

    const [currentPlan, setCurrentPlan] = useState('');
    const [parentPlan, setParentPlan] = useState('');

    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    
    const openAddModal = () => {
        setAddModalIsOpen(true);
        setParentPlan(plans[plans.length - 1].PlanId)
    };
    const openEditModal = (id) => {
        setEditModalIsOpen(true);
        setCurrentPlan(id);
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
                            جدول طرح ها
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
                                ParentPlanId = {parentPlan}
                            />

                            <EditModal 
                                showMoldal = {editModalIsOpen}
                                closeMoldal = {closeEditModal}
                                Plan = {currentPlan}
                            />


                        </div>
                    </div>

                    <div className="row">

                        <div id="accordion">
                            <div className="card">
                                <div className="card-header" id="headingOne" >
                                    <h3 className="mb-0">
                                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            طرح وام
                                        </button>
                                    </h3>
                                </div>

                                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                    <div className="card-body">
                                       
                                    <table className="table">
                                        <thead>
                                            <tr style={{textAlign:"center"}}> 

                                                <th scope="col">حذف</th>
                                                <th scope="col">ویرایش </th>
                                                <th scope="col"> تاریخ پایان</th>
                                                <th scope="col"> تاریخ شروع</th>
                                                <th scope="col"> توضیحات</th>
                                                <th scope="col">نام طرح </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {plans.map((plan) => (

                                                <tr key={plan.PlanId}>

                                                    <td>
                                                        <button className="tdbutton" onClick={() => dispatch(clearPlan(plan.PlanId))} > 
                                                            <span className="tblIcon" ><i className="far fa-times-circle"></i></span>
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="tdbutton" onClick={() => openEditModal(plan) } > 
                                                            <span className="tblIcon" ><i className="far fa-edit"></i></span>
                                                        </button>
                                                    </td>

                                                    <td>{plan.Tdate}</td>
                                                    <td>{plan.Fdate}</td>
                                                    <td>{plan.Description}</td>
                                                    <td>{plan.PlanName}</td>

                                                </tr>
                                            ))}
                                        
                                        </tbody>
                                    </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div id="accordion">
                            <div className="card">
                                <div className="card-header " id="headingTwo" >
                                    <h3 className="mb-0">
                                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                                            طرح کمک هزینه ازدواج
                                        </button>
                                    </h3>
                                </div>

                                <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo" data-parent="#accordion">
                                    <div className="card-body">
                                       
                                    <table className="table">
                                        <thead>
                                            <tr style={{textAlign:"center"}}>

                                                <th scope="col">حذف</th>
                                                <th scope="col">ویرایش </th>
                                                <th scope="col"> تاریخ پایان</th>
                                                <th scope="col"> تاریخ شروع</th>
                                                <th scope="col"> توضیحات</th>
                                                <th scope="col">نام طرح </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {plans.map((plan) => (

                                                <tr key={plan.PlanId}>

                                                    <td>
                                                        <button className="tdbutton" onClick={() => dispatch(clearPlan(plan.PlanId))} > 
                                                            <span className="tblIcon" ><i className="far fa-times-circle"></i></span>
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="tdbutton" onClick={() => openEditModal(plan) } > 
                                                            <span className="tblIcon" ><i className="far fa-edit"></i></span>
                                                        </button>
                                                    </td>

                                                    <td>{plan.Tdate}</td>
                                                    <td>{plan.Fdate}</td>
                                                    <td>{plan.Description}</td>
                                                    <td>{plan.PlanName}</td>

                                                </tr>
                                            ))}
                                        
                                        </tbody>
                                    </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default Plans;