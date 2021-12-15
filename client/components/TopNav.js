import {useState, useEffect, useContext} from 'react'
import {Menu} from "antd";
import Link from "next/link";
import {  AppstoreOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, CoffeeOutlined, CaretDownOutlined, UserOutlined  } from '@ant-design/icons';
import {Context} from '../context';
import axios from 'axios';
import { toast } from "react-toastify";
import {useRouter} from 'next/router';


const {Item, SubMenu, ItemGroup} = Menu;

const TopNav = () =>{
    const [current, setCurrent]= useState("");

    const {state, dispatch } = useContext(Context);

    const {user}= state;

    const router = useRouter()

    useEffect(() =>{
        process.browser && setCurrent(window.location.pathname)
    }, [process.browser && window.location.pathname]);

    const logout = async () =>{
        dispatch({type: "LOGOUT"});
        window.localStorage.removeItem("user");
        const {data} = await axios.get("/api/logout");
        toast(data.message)
        router.push('/login')
    }
    return(
       <Menu mode = "horizontal" selectedKeys={[current]} className="menu">
           <Item key = "/" onClick={e=>setCurrent(e.key)} icon = {<AppstoreOutlined/>}>
               <Link href="/">
                    <a>Home</a>
               </Link>
           </Item>
            {user === null && (
                <>
                <Item key = "/login" onClick={e=>setCurrent(e.key)} icon = {<LoginOutlined/>}>
               <Link href="/login">
                    <a>Login</a>
               </Link>
                </Item>

                <Item key = "/register" onClick={e=>setCurrent(e.key)} icon = {<UserAddOutlined/>}>
                    <Link href="/register">
                         <a>Register</a>
                    </Link>
                </Item>
                </>
            )}

            {user !==null && (

              <SubMenu key= "/submenu"icon ={<UserOutlined />} title={user && user.name} className="float-right">
                <ItemGroup>
                    <Item key = "/user">
                        <Link href="/user">
                            <a>Dashboard</a>
                        </Link>
                    </Item>
                    <Item key="/logout" onClick={logout} icon = {<LogoutOutlined/>} className="logout">
                         Logout
                    </Item>

                </ItemGroup>
              </SubMenu>
            )}
       </Menu>
    )
}

export default TopNav;