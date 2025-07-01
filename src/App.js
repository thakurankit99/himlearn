import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import PrivateRoute from './components/Routing/PrivateRoute';
import Home from "./components/GeneralScreens/Home"
import LoginScreen from "./components/AuthScreens/LoginScreen"
import RegisterScreen from "./components/AuthScreens/RegisterScreen"
import ForgotPasswordScreen from "./components/AuthScreens/ForgotPasswordScreen"
import ResetPasswordScreen from "./components/AuthScreens/ResetPasswordScreen"
import EmailVerification from "./components/AuthScreens/EmailVerification"
import AddContent from './components/StoryScreens/AddStory';
import DetailContent from './components/StoryScreens/DetailStory';
import Header from './components/GeneralScreens/Header';
import Footer from './components/GeneralScreens/Footer';
import Profile from './components/ProfileScreens/Profile';
import EditProfile from './components/ProfileScreens/EditProfile';
import ChangePassword from './components/ProfileScreens/ChangePassword';
import NotFound from './components/GeneralScreens/NotFound';
import EditContent from './components/StoryScreens/EditStory';
import LearningLibrary from './components/ProfileScreens/ReadListPage';
import AdminDashboard from './components/AdminScreens/AdminDashboard';
import AnnouncementsPage from './components/AnnouncementScreens/AnnouncementsPage';
import { AnnouncementProvider } from './Context/AnnouncementContext';

const App = () => {

      return (
            <Router>
                  <AnnouncementProvider>
                        <div className="App">

                              <Routes>
                              <Route path="/" element={<LayoutsWithHeader />}>

                                    <Route path='*' element={<NotFound />} />

                                    <Route exact path='/' element={<PrivateRoute />}>
                                          <Route exact path='/' element={<Home />} />
                                    </Route>

                                    <Route exact path="/learning-content/:slug" element={<DetailContent />} />

                                    <Route exact path='/add-content' element={<PrivateRoute />}>
                                          <Route exact path='/add-content' element={<AddContent />} />
                                    </Route>

                                    <Route exact path='/profile' element={<PrivateRoute />}>
                                          <Route exact path='/profile' element={<Profile />} />
                                    </Route>

                                    <Route exact path='/edit_profile' element={<PrivateRoute />}>
                                          <Route exact path='/edit_profile' element={<EditProfile />} />
                                    </Route>

                                    <Route exact path='/change_Password' element={<PrivateRoute />}>
                                          <Route exact path='/change_Password' element={<ChangePassword />} />
                                    </Route>

                                    <Route exact path='/learning-content/:slug/like' element={<PrivateRoute />}>
                                          <Route exact path='/learning-content/:slug/like' element={<DetailContent />} />
                                    </Route>

                                    <Route exact path='/learning-content/:slug/edit' element={<PrivateRoute />}>
                                          <Route exact path='/learning-content/:slug/edit' element={<EditContent />} />
                                    </Route>

                                    <Route exact path='/learning-content/:slug/delete' element={<PrivateRoute />}>
                                          <Route exact path='/learning-content/:slug/delete' element={<DetailContent />} />
                                    </Route>
                                    <Route exact path='/learning-content/:slug/addComment' element={<PrivateRoute />}>
                                          <Route exact path='/learning-content/:slug/addComment' element={<DetailContent />} />
                                    </Route>

                                    <Route exact path='/learning-library' element={<PrivateRoute />}>
                                          <Route exact path='/learning-library' element={<LearningLibrary />} />
                                    </Route>



                                    <Route exact path='/announcements' element={<AnnouncementsPage />} />

                                    <Route exact path='/admin' element={<PrivateRoute />}>
                                          <Route exact path='/admin' element={<AdminDashboard />} />
                                    </Route>

                                    <Route exact path="/login" element={<LoginScreen />} />
                                    <Route exact path="/register" element={<RegisterScreen />} />
                                    <Route exact path="/forgotpassword" element={<ForgotPasswordScreen />} />
                                    <Route exact path="/resetpassword" element={<ResetPasswordScreen />} />
                                    <Route exact path="/verify-email" element={<EmailVerification />} />

                              </Route>


                              </Routes>

                        </div>
                  </AnnouncementProvider>
            </Router>

      );

}

const LayoutsWithHeader = () => {
      return (
            <>
                  <Header />
                  <main className="pt-16 min-h-screen">
                        <Outlet />
                  </main>
                  <Footer />
            </>
      );
}

export default App;
