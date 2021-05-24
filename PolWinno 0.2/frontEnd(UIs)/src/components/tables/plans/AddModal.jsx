import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { createPlan } from '../../../action/plans';




const AddModal = ({showMoldal , closeMoldal , parentPlan}) => {

console.log(parentPlan);
    const [PlanName , setPlanName] = useState("");
    const [Description , setDescription] = useState("");
    const [PlanNature , setPlanNature] = useState(false);
    const [ParentPlanId , setParentPlanId] = useState(parentPlan);
    const [Fdate , setFdate] = useState("");
    const [Tdate , setTdate] = useState("");
    const [neededLogin , setNeededLogin] = useState(false);


    const dispatch = useDispatch();

    
    const resetState = () => {
        setPlanName('');
        setDescription('');
        setPlanNature('');
        setParentPlanId('');
        setFdate('');
        setTdate('');
        setNeededLogin();
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        let plan = new FormData()

        plan.append("PlanName" , PlanName);
        plan.append("Description" , Description);
        plan.append("Fdate" , Fdate);
        plan.append("Tdate" , Tdate);
        plan.append("PlanNature" , PlanNature);
        plan.append("neededLogin" , neededLogin);
        plan.append("ParentPlanId" , ParentPlanId);
        
        try {
            dispatch(createPlan(plan));
            
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
                            <label className="iconpic" htmlFor="file"> آیکن طرح را وارد کنید
                                <input className="input-style" type="file" name="iconUrl" />
                            </label>
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="نام طرح" required name="PlanName" value={PlanName}
                                onChange={e => setPlanName(e.target.value) } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="تاریخ پایان" name="Tdate" value={Tdate}
                                onChange={e => setTdate(e.target.value) } />
                        </div>
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="تاریخ شروع" name="Fdate" value={Fdate}
                                onChange={e => setFdate(e.target.value) } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group cashRadio">
                                <label>ماهیت طرح : </label>
                                <div>
                                    <label className="radio-container">نقدی
                                        <input type="radio" name="planNature" 
                                            onChange={e => setPlanNature(e.currentTarget.checked)} />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="radio-container">غیر نقدی
                                        <input type="radio"  />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="chckbox">
                                <input type="checkbox" name="neededLogin" value={neededLogin}
                                    onChange={e =>setNeededLogin(e.currentTarget.checked)}/>{" "}
                                آیا در این طرح خیر نیاز به لاگین دارد؟{" "}
                            </label>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-12">
                            <input type="text" className="form-control" placeholder="توضیحات" name="Description" value={Description}
                                onChange={e => setDescription(e.target.value) } />
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

