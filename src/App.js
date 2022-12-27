import { useEffect, useState } from 'react';
import axios from "axios";
import './App.css';
import Barchart from './components/BarChart';
import Linechart from './components/LineChart';
import moment from 'moment'
import 'moment/locale/zh-tw';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FileUploadSingle from './components/FileUpload';
import img_box from './img/610.png'
import { AppBar, Typography,Paper} from '@mui/material';




function App() {
  var url = "https://nchu2022-bee.onrender.com/hiveData/";
  const hiveid = "";
  const limit = "";
  const [beeData, setbeeData] = useState({labels:"",datasets:[{label:"test",data:[]}]});
  const [HiveData, setHiveData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  const [BOXID, setBOXID] = useState();
  moment.locale("zh-tw");  
  var result = {};
  

  const handleClick = async (HiveID) => {
    url = url+HiveID
    setIsLoading(true);
    try {
      const response = await fetch(url, {method: 'GET',});

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      result = await response.json();
      setBOXID(result[0].HiveID);
      
      result = result.sort((a,b)=>new Date(a.CreateTime)- new Date(b.CreateTime))
      setbeeData({
        labels:result.map((item)=>moment(item.CreateTime).format("LLL")),
        datasets:[
          {
            label:"蜜蜂數量",
            data:result.map((item)=>item.NumberOfBees),
            backgroundColor:result.map((item)=>item.HasHornets=="Y"?"rgba(255, 99, 132, 0.5)":"rgba(53, 162, 235, 0.5)"),
            pointRadius:10
          }
        ]
      })
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(()=>{
    const fetch = async()=>{
      var {data} = await axios.get("https://nchu2022-bee.onrender.com/")
      data = data.sort((a,b)=>new Date(a.HiveID)- new Date(b.HiveID))
      setHiveData(data)
    }
    fetch()
  },[])



  return (
<div className="App">
<>
  <Container>
    <Row>
    <AppBar sx={{
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }} position="static" color="inherit">
        <Typography sx={{
        color: 'rgba(0,183,255, 1)',
      }}  variant="h2" align="center">NCHU-物聯網-智慧擊鮮蜂</Typography>
      </AppBar>
    </Row>
    <Row>
      <Col>
        <Table borderless="true">
          <tbody >
            <tr>
              {HiveData == null? null: HiveData.map((item) => (
                    <td>
                      <Button variant="secondary">
                        <img
                          src={img_box}
                          alt="蜂箱"
                          onClick={() => handleClick(item.HiveID)}/>
                        蜂箱{item.HiveID}
                      </Button>
                    </td>
                  ))}
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
    <Row>
      <Col>
      {BOXID!=undefined?"蜂箱"+BOXID:""}
        <div className="chart-container">
          <Linechart chartData={beeData} />
        </div>
      </Col>
    </Row>
    <hr/>
    <Row>
      <Col>
        <div>
          <FileUploadSingle BOX_ID={BOXID}></FileUploadSingle>
        </div>
      </Col>
    </Row>
  </Container>
</>

</div>

  );
}

export default App;
