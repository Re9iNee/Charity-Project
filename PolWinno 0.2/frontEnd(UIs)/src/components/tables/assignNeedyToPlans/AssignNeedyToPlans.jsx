import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAssignNeedyToPlans, getAssignNeedyToPlans } from '../../../action/assNeedyToPlans';
import { getPerson } from '../../../action/personal';
import { getPlans } from '../../../action/plans';
import AddModal from './AddModal';

const AssignNeedyToPlans = () => {


    const dispatch = useDispatch();
    
    useEffect( () => {
        dispatch(getAssignNeedyToPlans());
        dispatch(getPerson());
        dispatch(getPlans());
    } , [] );
    
   
    const assignNeedyToPlans = useSelector(state => state.assignNeedyToPlans);
    const needies = useSelector(state => state.persons);
    const plans = useSelector(state => state.plans);

    const [addModalIsOpen, setAddModalIsOpen] = useState(false);

    const openAddModal = () => {
        setAddModalIsOpen(true);
    };
    
    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };
   



    return ( 

        <section style={{ marginTop: "5em", padding: "0 20px" }}>
            <div >
                <div>
                    <div className="row">
                        <h3 className="tableTitle text-center">
                            جدول تخصیص نیازمند به طرح
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
                                needies = {needies}
                                plans = {plans}
                            />


                        </div>
                    </div>

                    <div className="row">

                        <table className="table">
                            <thead>
                                <tr>

                                    <th scope="col">حذف</th>
                                    <th scope="col">تاریخ پایان</th>
                                    <th scope="col">تاریخ شروع</th>
                                    <th scope="col">نام طرح</th>
                                    <th scope="col">نام خانوادگی نیازمند</th>
                                    <th scope="col">نام نیازمند </th>

                                </tr>
                            </thead>
                            <tbody>
                                {assignNeedyToPlans.map((assignNeedyToPlan) => (

                                    <tr key={assignNeedyToPlan.AssignNeedyPlanId}>

                                        <td>
                                            <button className="tdbutton" onClick={() => dispatch(clearAssignNeedyToPlans(assignNeedyToPlan.AssignNeedyPlanId))} > 
                                                <span className="tblIcon" ><i className="far fa-times-circle"></i></span>
                                            </button>
                                        </td>

                                        <td>{assignNeedyToPlan.Tdate}</td>
                                        <td>{assignNeedyToPlan.Fdate}</td>
                                        <td>{assignNeedyToPlan.PlanName}</td>
                                        <td>{assignNeedyToPlan.Family}</td>
                                        <td>{assignNeedyToPlan.Name}</td>
                                       

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
 
export default AssignNeedyToPlans;