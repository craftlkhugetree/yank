import torch
x = torch.arange(12)
x

# import requests
 
# def get_jiracookie():
#     username, password = "******", "******"
#     # 用用户名/密码请求鉴权，获取cookie---JSESSIONID
#     url = "https://jira.hobot.cc:8443/login.jsp"
# headers =  {"Content-Type":"application/x-www-form-urlencoded"}
#     payload = f"os_username={username}&os_password={password}&os_destination=&user_role=&atl_token=&login=Log+In"
#     res = requests.post(url = url, data = payload, headers = headers, allow_redirects = False)# 通过参数allow_redirects禁用重定向
#     cookie_res = requests.utils.dict_from_cookiejar(res.cookies)# 把返回的cookies转换成字典
 
#     # 访问，获取cookie---atlassian.xsrf.token
#     url = "https://jira.hobot.cc:8443/"
# res = requests.get(url = url, cookies = cookie_res, allow_redirects = False)
#     cookie_res2 = requests.utils.dict_from_cookiejar(res.cookies)# 把返回的cookies转换成字典
#     cookie_res["atlassian.xsrf.token"] = cookie_res2["atlassian.xsrf.token"]
#     cookie = "; ".join([ f"{name}={value}" for name, value in cookie_res.items()])
 
#     return cookie
 
# if __name__ == "__main__":
#     JIRA_Cookie = get_jiracookie()
#     print(JIRA_Cookie)
