import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MorningCheckIn from "./components/MorningCheckIn";
import MidDayBoost from "./components/MidDayBoost";
import EveningReflection from "./components/EveningReflection";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import axios from "axios";
import "./App.css";

function App() {
    const [username, setUsername] = useState(localStorage.getItem("username") || ""); // username 상태
    const [profileImageUrl, setProfileImageUrl] = useState(""); // 프로필 이미지 URL 상태

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (username) {
                try {
                    const response = await axios.get(`/api/users/${username}`);
                    const profileImageUrlWithTimestamp = `${response.data.profileImageUrl}?timestamp=${new Date().getTime()}`;
                    setProfileImageUrl(profileImageUrlWithTimestamp); // 타임스탬프 추가
                } catch (error) {
                    console.error("Failed to fetch profile image", error);
                }
            }
        };

        fetchUserProfile();
    }, [username]);


    // 로그인 핸들러
    const handleLogin = (username) => {
        setUsername(username);
        localStorage.setItem("username", username);
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        setUsername("");
        setProfileImageUrl(""); // 로그아웃 시 프로필 이미지 초기화
        localStorage.removeItem("username");
    };

    return (
        <Router>
            <div className="app-container">
                {/* 상태를 NavigationBar에 전달 */}
                <NavigationBar
                    username={username}
                    profileImageUrl={profileImageUrl}
                    handleLogout={handleLogout}
                />
                <Routes>
                    {/* 프로필 페이지 */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile
                                    username={username}
                                    setProfileImageUrl={setProfileImageUrl} // 상태 업데이트 함수 전달
                                />
                            </ProtectedRoute>
                        }
                    />
                    {/* 로그인 및 회원가입 */}
                    <Route path="/login" element={<Login setUser={handleLogin} />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* 보호된 경로 */}
                    <Route
                        path="/morning-checkin"
                        element={
                            <ProtectedRoute>
                                <MorningCheckIn username={username} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/midday-boost"
                        element={
                            <ProtectedRoute>
                                <MidDayBoost username={username} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/evening-reflection"
                        element={
                            <ProtectedRoute>
                                <EveningReflection username={username} />
                            </ProtectedRoute>
                        }
                    />
                    {/* 기본 경로 */}
                    <Route path="*" element={<Navigate to="/morning-checkin" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
