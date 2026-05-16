import { Link } from "react-router-dom";


export default function TableDashBord({head ,title}) {
  return (
    <>
    <div className="contaner " >
        <div className="d-flex justify-content-between m-3">
            <h3>{head}</h3>
            <Link to={"add"} className="btn btn-primary">  Add New{title}</Link>
        </div>
      
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>John</td>
      <td>Doe</td>
      <td>@social</td>
    </tr>
  </tbody>
</table>
    </div>
    </>
  )
}
