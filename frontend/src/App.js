import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {

  const [msg,setmsg] = useState("")
  const[status,setstatus]=useState(false)
  const[emailList,setEmailList]=useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event){
    const file=event.target.files[0]
       const reader=new FileReader()
       reader.onload=function(event){
         const data=event.target.result
        const workbook=XLSX.read(data,{type:"binary"})
        const sheetName=workbook.SheetNames[0]
        const worksheet=workbook.Sheets[sheetName]
        const emailList=XLSX.utils.sheet_to_json(worksheet,{header:"A"})
        const totalemail=emailList.map(function(item){
             return item.A
        })
        console.log(totalemail)
        setEmailList(totalemail)
       }

       reader.readAsBinaryString(file)
  }

  function send(){
    setstatus(true)
    axios.post("http://localhost:5000/sendemail",{msg:msg,emailList:emailList})
    .then(function(data){
      if(data.data===true){
        alert("Email sent successfully!")
        setstatus(false)
      }
      else{
        alert("Failed to send email.")
      }
    })
  }

  return (  
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-6 py-4">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className=" font-medium px-6 py-4">Helping Your Business Send Bulk Emails Easily</h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h1 className=" font-medium px-6 py-4">Drag & Drop Your File</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-7">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-4 outline-none px-2 border border-black rounded-md " placeholder="Enter the email text...."></textarea>
        <div>
          <input onChange={handlefile} type="file" className="border-4 border-dashed py-4 px-4 mt-5 mb-5" />
        </div>
        <p>Total Emails in the file:{emailList.length}</p>
        <button onClick={send} className="bg-blue-950 mt-2 py-2 px-5 text-white font-medium rounded-md w-fit">{status?"Sending...":"Send"}</button>
      </div>

      <div className="bg-blue-300 text-white text-center p-10"></div>
      <div className="bg-blue-200 text-white text-center p-10"></div>

    </div>
  );

}

export default App;
