import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { updateBaseType } from '../../../action/cmnBaseType';
import { toast } from 'react-toastify';




const AddModal = ({showMoldal , closeMoldal , baseType}) => {

    const [title , setTitle] = useState("");

    const dispatch = useDispatch();


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            await dispatch(updateBaseType(baseType.CommonBaseTypeId , title));
            
            setTitle(title);

        } catch (err) {
            toast.error("رکورد انتخاب شده ویرایش نشد", {
                position: "bottom-right",
                closeOnClick: true
            });
            console.log(err);
        }
    }


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
                    <form id="baseTypeFormEdit" onSubmit={handleSubmit} >
                        <div className="row">
                            <div className="col-md-12">
                                <input type="text" className="form-control" placeholder={baseType.BaseTypeTitle} value={title}
                                    onChange={e => setTitle(e.target.value) } />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <button className="btn" type="submit" form="baseTypeFormEdit" value="Submit">ویرایش</button>
                            </div>
                            <div className="col-md-6">
                                <button className="btn" onClick={() =>{closeMoldal();window.location.reload()}} >خروج</button>
                            </div>
                        </div>
                    </form>
                </div>

            </Modal>
     );
}
 
export default AddModal;

