import "./App.css";
import "./css/reset.css";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/header/NavBar";
import Search from "./components/home/Search";
import SliderOne from "./components/home/SliderOne";
import SliderTwo from "./components/home/SliderTwo";
import SliderThree from "./components/home/SliderThree";
import Accommo from "./components/sub/Accommo";
import AccommoTitle from "./components/sub/AccommoTitle";
import AccommoDescription from "./components/sub/AccommoDescription";
import Amenities from "./components/sub/Amenities";
import LocationReservationNotice from "./components/sub/LocationReservationNotice";
import Searchopen from "./components/searchopen/Searchopen";
import BoardList from "./components/board/BoardList";
import NewBoardForm from "./components/board/NewBoardForm";
import UpdateBoardForm from "./components/board/UpdateBoardForm";
import LoginForm from "./components/user/LoginForm";
import SignupForm from "./components/user/SignupForm";
import BoardView from "./components/board/BoardView";
import ScrollToTop from "./js/ScrollToTop";
import Review from "./components/review/Review";

function App() {
  return (
    <div className="App">
      <NavBar />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Search />
              <SliderOne />
              <SliderTwo />
              <SliderThree />
            </div>
          }
        />
        <Route
          path="/accommo"
          element={
            <div>
              <Accommo />
              <AccommoTitle />
              <AccommoDescription />
              <Amenities />
              <LocationReservationNotice />
            </div>
          }
        />

        <Route
          path="/searchopen"
          element={
            <div>
              <Searchopen />
            </div>
          }
        />

        <Route
          path="/board"
          element={
            <div>
              <BoardList />
            </div>
          }
        />

        <Route
          path="/newboard"
          element={
            <div>
              <NewBoardForm />
            </div>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <div>
              <UpdateBoardForm />
            </div>
          }
        />

        <Route
          path="/login"
          element={
            <div>
              <LoginForm />
            </div>
          }
        />

        <Route
          path="/signup"
          element={
            <div>
              <SignupForm />
            </div>
          }
        />
        <Route path="/view/:id" element={<BoardView />} />
        <Route
          path="/review"
          element={
            <div>
              <Review />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
