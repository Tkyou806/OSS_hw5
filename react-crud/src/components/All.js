import React, { useState, useEffect, useCallback } from "react";
import '../index.css';

const Data = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        age: "",
        gender: "",
        country: "",
        job: "",
    });
    //이건 Show List를 위한 거
    const [showList, setShowList] = useState(false);
    //이건 Modal을 위한 거
    const [modalType, setModalType] = useState(null);

    // 목에서 Fetch하자. 
    const fetchData = async () => {
        try {
            const response = await fetch("https://672818a8270bd0b975544f01.mockapi.io/api/v1/users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Fail fetching Data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Create Data Jone!
    const createData = async () => {
        try {
            const response = await fetch("https://672818a8270bd0b975544f01.mockapi.io/api/v1/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.status === 201) {
                fetchData();
                resetForm();
            }

        } catch (error) {
            console.error("Fail creating Data:", error);
        }

    };

    // Update Data Jone!
    const updateData = async () => {
        try {
            const response = await fetch(`https://672818a8270bd0b975544f01.mockapi.io/api/v1/users/${formData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                fetchData();
                resetForm();
            }

        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    // Delete Data Jone!
    const deleteData = useCallback(async () => {
        try {
            const response = await fetch(`https://672818a8270bd0b975544f01.mockapi.io/api/v1/users/${formData.id}`, {
                method: "DELETE",
            });
            if (response.status === 200) {
                fetchData();
                resetForm();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }, [formData.id]);

    // 다시 load할 때,  중복되지 않게 비워주자
    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            age: "",
            gender: "",
            country: "",
            job: "",
        });
    };

    //delete는 모달 사용하고 싶지X, 따로 또 이벤트를 달아주자
    useEffect(() => {
        if (modalType === "delete") {
            deleteData();  // Data 삭제
            setModalType(null); // 모달 안나오게 바로 닫자
        }
    }, [modalType, deleteData]);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className="container">
            <h1 className="mt-3 div_title" >AJAX CRUD</h1>
            <p>You can show list, create data, update data, and delete data!</p>

            <div className="mb-3">
                <label>ID:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                />
            </div>
            <div className="mb-3">
                <label>Name:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div className="mb-3">
                <label>Age:</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
            </div>
            <div className="mb-3">
                <label>Gender:</label>
                <div>
                    <input
                        type="radio"
                        name="gender"
                        value="MAN"
                        checked={formData.gender === "MAN"}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                    MAN
                    <input
                        type="radio"
                        name="gender"
                        value="WOMAN"
                        checked={formData.gender === "WOMAN"}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                    WOMAN
                </div>
            </div>
            <div className="mb-3">
                <label>Country:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
            </div>
            <div className="mb-3">
                <label>Job:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                />
            </div>

            <button className="btn btn-primary me-2 button_css" onClick = {() => setModalType("create")}>
                Create
            </button>
            <button className="btn btn-warning me-2 button_css" onClick = {() => setModalType("update")}>
                Update
            </button>
            <button className="btn btn-danger button_css" onClick = {() => setModalType("delete")}>
                Delete
            </button>
            {/* 여기 좀 더 이쁘게 조정 */}
            <button className="btn btn-primary me-2 button_css" style = {{ marginLeft: '10px' }} onClick = {() => setShowList(true)}>
                Show List
            </button>

            {showList && (
                <div>
                    <h2 className="mt-5 div_jone"> User List </h2>
                    <div>
                        {users.map((user) => (
                            <div key={user.id}>
                                {user.id}. {user.name}, {user.age}, {user.gender}, {user.country}, {user.job}
                            </div>
                        ))
                        }
                    </div>
                </div>
            )
            }

            {/* 모달이다~~~~~~~~~~~~~ ==>여기는 create, update만 다루자*/}
            {(modalType === "create" || modalType === "update") && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                {/* 여기 간단하게 모달 타입을 함수명으로 바꾸자.(안그러면 너무 길어짐) ==> 첫글자Upper로 + 뒤는 그대로 따라오게! */}
                                <h5 className="modal-title">{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Data</h5>
                                <button type="button" className="btn-close" onClick={() => setModalType(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Would you {modalType} this data?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setModalType(null)}>Cancel</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (modalType === "create") createData();
                                        if (modalType === "update") updateData();
                                        setModalType(null);
                                    }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Data;
