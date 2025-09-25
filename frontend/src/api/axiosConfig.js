import axios from 'axios';

// 1. 기본 설정: 백엔드 서버 주소
const api = axios.create({
    baseURL: 'http://localhost:8080'
});

// 2. 요청(Request) 인터셉터
api.interceptors.request.use(
    (config) => {
        // localStorage에 저장된 토큰 가져오기
        const token = localStorage.getItem('token');

         // 토큰이 꼭 필요한 요청인지 확인 (POST, PUT, DELETE만 체크)
        const needToken = 
            ['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase()) &&
             !config.url.startsWith('/api/auth/');  // 로그인/회원가입 같은 요청은 제외

        // 토큰이 필요한데 없거나 잘못된 경우
        if (needToken) {
            if (!token) {
                return Promise.reject(new Error('로그인이 필요합니다.'));
            }

            try {
                // JWT 토큰 해석해서 만료 시간 확인
                const payload = JSON.parse(atob(token.split('.')[1])); // 중간 부분(payload) 해석
                const now = Date.now() / 1000; // 현재 시간(초 단위)

                if (payload.exp < now) {
                    // 토큰 만료 → 제거 후 에러
                    localStorage.removeItem('token');
                    return Promise.reject(new Error('로그인이 만료되었습니다. 다시 로그인해주세요.'));
                }
            } catch (err) {
                // 토큰이 잘못된 경우
                localStorage.removeItem('token');
                return Promise.reject(new Error('유효하지 않은 토큰입니다. 다시 로그인해주세요.'));
            }
        }

        // 토큰이 있으면 요청 헤더에 넣어주기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 3. 응답(Response) 인터셉터
api.interceptors.response.use(
    (response) => response, // 성공 시 그대로 반환
    (error) => {
        // 서버에서 온 에러 처리
        if (error.response) {
            switch (error.response.status) {
                case 401: // 인증 실패
                    localStorage.removeItem('token');
                    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = '/login';
                    break;
                case 403: // 권한 없음
                    alert('이 작업을 할 권한이 없습니다.');
                    break;
                default:
                    console.error('API 에러:', error);
            }
        } else if (error.message.includes('로그인')) {
            // 요청 인터셉터에서 걸러진 경우
            alert(error.message);
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
