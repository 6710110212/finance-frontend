import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd';
import axios from 'axios'

const URL_AUTH = "/api/auth/local"

export default function LoginScreen(props) {

  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true)
      setErrMsg(null)
      const response = await axios.post(URL_AUTH, { ...formData })
      const token = response.data.jwt

      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      props.onLoginSuccess();
    } catch (err) {
      console.log(err)
      setErrMsg(err.message)
    } finally { setIsLoading(false) }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <Form
      onFinish={handleLogin}
      autoComplete="off">
      {errMsg &&
        <Form.Item>
          <Alert message={errMsg} type="error" />
        </Form.Item>
      }

      <Form.Item
        label="Username"
        name="identifier"
        rules={[{ required: true, }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true },]}>
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Checkbox onChange={handleRememberMeChange}>Remember Me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
