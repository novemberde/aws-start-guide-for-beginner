# AWS Start Guide For Beginner

Amazon Web Service에 대해서 처음 접해보는 사람도 따라서 웹서버를 올릴 수 있도록 하는 가이드입니다.

## 목차

1. 클라우드란?
2. Amazon Web Service 소개
3. EC2 소개
4. EC2로 Ubuntu 시작하기
5. Ubuntu에 Node.js 서버 올려보기
6. Load Balancer 소개
7. ALB 구성하기
8. S3란?
9. EC2에 이미지 업로드 서버 만들기
10. RDS란?
11. Aurora MySQL과 Node.js 서버 연동하기
12. 부록: Route53 으로 도메인 관리하기

[PPT 보러가기](https://docs.google.com/presentation/d/1DhguMENk6OiSC-OObEswgsYChIAF_r6E9r07caMpdC8/edit?usp=sharing)

## IMPORTANT

#### ⚠️과정을 진행하며 생성한 리소스는 모두 삭제하길 바랍니다. 비용이 청구될 수 있습니다.⚠️

이번에 생성한 리소스들은 [EC2 콘솔](https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home)이나
[ELB 콘솔](https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-northeast-2#LoadBalancers:),
그리고 [RDS 콘솔](https://ap-northeast-2.console.aws.amazon.com/rds/home)에서 확인할 수 있습니다.

혹시라도 생성버튼을 누른 기억이 있는데 여기 콘솔 리스트에 없다면 우측 상단의 리전을 바꾸어가며 확인 바랍니다.
이외의 리소스(s3, target group, security group)는 과금이 되지 않을 예정이니 걱정하지 않으셔도 괜찮습니다.

## EC2로 Ubuntu 시작하기

[EC2 콘솔](https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home)에 접속합니다.

인스턴스 항목을 클릭합니다.

![ec2-1](/images/ec2-1.png)

---

인스턴스 시작을 클릭합니다.

![ec2-2](/images/ec2-2.png)

---

### 1 단계: AMI 선택

Ubuntu 18.04를 선택합니다.

![ec2-3](/images/ec2-3.png)


---

### 2 단계: 인스턴스 유형 선택

T2.micro를 선택합니다.

![ec2-4](/images/ec2-4.png)

---

### 3 단계: 인스턴스 구성

기본값을 그대로 두고 다음버튼을 클릭합니다.

---

### 4 단계: 스토리지 추가

크기를 16 GiB로 수정하고 다음 버튼을 클릭합니다.

![ec2-5](/images/ec2-5.png)

---

### 5 단계: 태그 추가

태그는 지정하는 습관을 가져야합니다.

나중에 서비스가 다양해질 경우 태그로 서비스들을 구분할 수 있습니다.

다음과 같이 태그를 추가합니다.

- 태그명: Name
- 값: YjdWorkshop

![ec2-6](/images/ec2-6.png)

---

### 6 단계: 보안 그룹 구성

보안 그룹(Security Group) 설정은 필수적입니다.

AWS 상의 VPC 네트워크에 생성되는 리소스는 보안 그룹 설정이 필요합니다.

반드시 필요한 포트(Port)와 아이피만 트래픽을 허용합니다.

사용하지 않는 포트는 절대 설정하지 않습니다.

설정 정보는 다음과 같습니다.

- 보안 그룹 이름: YjdEC2SG
- 설명: YJD Codelab EC2 Security Group
- 포트 설정
    - TCP 22(ssh): 내 IP
    - TCP 8080: 위치 무관

![ec2-7](/images/ec2-7.png)


### 7 단계: 검토

시작 버튼을 누르면 다음과 같은 화면이 나옵니다. 다음과 같이 입력하고 "키페어 다운로드" 버튼을 클릭합니다.

![ec2-8](/images/ec2-8.png)

AWS의 EC2는 일반적으로 아이디/패스워드 형태로 로그인하지 않습니다.
EC2는 Public Key를 가지고 있고 Private Key를 가진 사람만이 로그인할 수 있습니다.
키페어는 AWS에서 관리하는 키쌍입니다. 생성하고 다운로드하여 분실하지 않도록 주의합니다.
분실하는 순간 운영하는 서비스도 위험해질 것입니다.

"인스턴스 시작" 버튼을 눌러 생성을 완료합니다.

## Ubuntu에 Node.js 서버 올려보기

### Ubuntu에 접속하기

먼저 EC2의 PUBLIC DNS 또는 IP 주소는 다음과 같은 화면에서 가져올 수 있습니다. 값을 복사해둡니다.

![ec2-9](/images/ec2-9.png)

Ubuntu에 SSH로 접속하기 위해선 SSH-Client가 필요합니다.

접속하는 방법은 Linux계열과 Windows 계열에 따라 다릅니다.

#### MAC 또는 Linux 사용자의 경우

접속하기 전에 다운로드한 키파일의 권한을 수정해야합니다.

다음과 같은 명령어로 수정합니다.
'KEY_FILE_DIR/KEY_FILE.pem'은 해당 파일을 드래그하여 터미널에 드롭시키면 바로 입력이 가능합니다.

```sh
$ chmod 600 KEY_FILE_DIR/KEY_FILE.pem
```

Terminal을 열어 다음과 같이 접속합니다.


```sh
$ ssh -i KEY_FILE_DIR/KEY_FILE.pem ubuntu@EC2_PUBLIC_DNS_URL
```

#### Windows 사용자의 경우

먼저 Git bash를 설치합니다. Git을 설치할 때 옵션으로 추가할 수 있습니다.

Git bash terminal을 열어 다음과 같이 접속합니다.
'KEY_FILE_DIR/KEY_FILE.pem'은 해당 파일을 드래그하여 터미널에 드롭시키면 바로 입력이 가능합니다.

```sh
$ ssh -i KEY_FILE_DIR/KEY_FILE.pem ubuntu@EC2_PUBLIC_DNS_URL
```

### Node.js 서버 실행하기

Ubuntu 서버에 접속하였습니다.

다음과 같이 Node.js를 설치합니다.

```sh
$ sudo apt update
$ sudo apt install nodejs
$ sudo apt install npm
```

다음 명령어를 통해 소스코드를 받아오고 Node.js 서버를 실행시켜줍시다.

```sh
$ git clone https://github.com/novemberde/aws-start-guide-for-beginner.git
$ cd aws-start-guide-for-beginner/sample-server
$ npm install
$ node app.js
```

서버가 실행하는 것을 확인한 후에 브라우저를 열어 해당 페이지에 접근합니다.

EC2_PUBLIC_DNS_URL:8080 으로 접속하시면 됩니다.

## EC2에 이미지 업로드 서버 만들기

```sh
$ cd ~/aws-start-guide-for-beginner/upload-server
$ npm install
$ export BUCKET_NAME=BUCKET_NAME_ON_S3
$ node app.js
```

### AWS IAM Role과 User의 차이

- [AWS IAM Role](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/id_roles.html): AWS내에서 Resource 간에 접근하기 위해 사용함
- [AWS IAM User](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/id_users.html): 외부에서 AWS에 접근하기 위해 사용함

## RDS MySQL과 Node.js 서버 연동해보기

### 데이터베이스 생성하기

[RDS 콘솔](https://ap-northeast-2.console.aws.amazon.com/rds/home)로 이동하여 데이터베이스 생성 버튼을 누릅니다.

MySQL을 선택하고 MySQL 8.x.x 버전을 선택합니다.

![rds-1](/images/rds-mysql-1.png)

---

템플릿으로 프리티어를 선택하고 다음과 같이 설정합니다.

- DB 인스턴스 식별자: YjdInstance
- 마스터 사용자 이름: yjd_master
- 마스터 암호: pwd12341234

![rds-mysql-2](/images/rds-mysql-2.png)

---

다음과 같이 퍼플릭 엑세스를 허용하고 VPC 보안 그룹을 새로 생성합니다.

- 퍼플릭 엑세스 가능: 예
- VPC 보안 그룹: 새로 생성
- 새 VPC 보안 그룹 이름: YjdRdsSG
- 데이터베이스 포트: 3306

![rds-mysql-3](/images/rds-mysql-3.png)

---

추가 구성은 대부분 기본값으로 두고 
한 가지 설정만 합니다.

- 데이터베이스 이름: db

![rds-mysql-4](/images/rds-mysql-4.png)

---

이전에 생성한 EC2는 데이터 베이스에 대한 접근 권한을 가지고 있지 않습니다.
데이터베이스에 접근 가능하도록 설정합니다.

생성한 후 아래와 같은 화면에서 설정된 보안그룹을 클릭합니다.

![rds-mysql-3](/images/rds-mysql-5.png)

---

다음과 같이 인바운드 규칙을 추가합니다.
사용자 지정 인풋에 'YjdEC2SG'를 입력하면 EC2를 생성할 때
만든 Security Group이 나타나는데, 이를 선택해주시면 됩니다.

- TCP 3306
- 사용자 지정: YjdEC2SG

![aurora-4](/images/aurora-4.png)

---

다음과 같은 화면에서 엔드포인트 부분을 복사합니다.

![rds-mysql-5](/images/rds-mysql-6.png)

---

EC2로 다시 접속하여 다음과 같이 입력하고 DB와의 접속이 일어나는지 확인합니다.
AURORA_WRITE_ENDPOINT로 방금 복사한 엔드포인트 값을 넣어줍니다.

```sh
$ export MYSQL_HOST=MYSQL_ENDPOINT
$ cd ~/aws-start-guide-for-beginner/aurora-server
$ npm install
$ node app.js

Server is running at 8080
Executing (default): CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER auto_increment , `username` VARCHAR(255), `birthday` DATETIME, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `users`
```

## ALB 올려보기

### 참고

- [Application Load Balancer 구성 요소](https://docs.aws.amazon.com/ko_kr/elasticloadbalancing/latest/application/introduction.html)

## Route53으로 도메인 관리하기

## ACM으로 인증서 발급하기

### 참고

- [Amazon Route 53란 무엇입니까?](https://docs.aws.amazon.com/ko_kr/Route53/latest/DeveloperGuide/Welcome.html)

## 리소스 삭제하기

오늘 생성한 리소스는 다음과 같습니다. 직접 콘솔로 들어가서 삭제하여 주세요.

- [RDS MySQL](https://ap-northeast-2.console.aws.amazon.com/rds/home?region=ap-northeast-2)
- [EC2](https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-northeast-2#Instances:sort=instanceId)
- [ALB](https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-northeast-2#LoadBalancers:sort=loadBalancerName)
- [Target Group](https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-northeast-2#TargetGroups:sort=targetGroupName)
- [S3](https://console.aws.amazon.com/s3/home?region=ap-northeast-2)
