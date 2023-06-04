import { useNavigate } from "react-router-dom";

//pour naviguer depuis home vers la gallery
function NavigateTo(path) {
  const navigate = useNavigate();
  navigate(path);
}

export default NavigateTo;
