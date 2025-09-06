/**
 * NBTI 길드 데이터 관리자
 * JSON 파일 기반 데이터 관리 시스템
 */

class DataManager {
  constructor() {
    this.dataPath = './data/';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5분 캐시
  }

  /**
   * JSON 파일에서 데이터 로드
   * @param {string} filename - 파일명 (예: 'photos.json')
   * @returns {Promise<Object>} - 로드된 데이터
   */
  async loadData(filename) {
    const cacheKey = filename;
    const cached = this.cache.get(cacheKey);
    
    // localStorage에서 백업 데이터 확인
    const localData = this.loadFromLocalStorage(filename);
    
    // 캐시된 데이터가 있고 유효한 경우
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      // localStorage에 더 최신 데이터가 있는지 확인
      if (localData.lastUpdated > cached.data.lastUpdated) {
        console.log(`localStorage에 더 최신 데이터 발견: ${filename}`);
        // localStorage 데이터를 캐시에 업데이트
        this.cache.set(cacheKey, {
          data: localData,
          timestamp: Date.now()
        });
        return localData;
      }
      return cached.data;
    }

    try {
      const response = await fetch(`${this.dataPath}${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status}`);
      }
      
      const data = await response.json();
      
      // localStorage 데이터와 비교하여 더 최신 데이터 사용
      // localStorage에 유효한 데이터가 있으면 우선 사용
      let finalData = data;
      if (localData && localData.lastUpdated > 0) {
        if (localData.lastUpdated > data.lastUpdated) {
          console.log(`localStorage 데이터가 더 최신: ${filename}`);
          finalData = localData;
        } else {
          // JSON 파일이 더 최신이면 localStorage 업데이트
          this.saveToLocalStorage(filename, data);
        }
      } else {
        // localStorage에 데이터가 없으면 JSON 파일 데이터를 localStorage에 저장
        this.saveToLocalStorage(filename, data);
      }
      
      // 캐시에 저장
      this.cache.set(cacheKey, {
        data: finalData,
        timestamp: Date.now()
      });
      
      return finalData;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      // 오프라인 모드: localStorage에서 백업 데이터 로드
      if (localData && localData.lastUpdated > 0) {
        console.log(`오프라인 모드: localStorage에서 ${filename} 로드`);
        return localData;
      } else {
        // localStorage에도 데이터가 없으면 기본 데이터 반환
        console.log(`기본 데이터 반환: ${filename}`);
        return this.getDefaultData(filename);
      }
    }
  }

  /**
   * localStorage에서 백업 데이터 로드
   * @param {string} filename - 파일명
   * @returns {Object} - 백업 데이터
   */
  loadFromLocalStorage(filename) {
    const key = filename.replace('.json', '');
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        // 유효한 데이터인지 확인
        if (parsed && typeof parsed === 'object' && parsed.lastUpdated) {
          return parsed;
        }
      }
      return this.getDefaultData(filename);
    } catch (error) {
      console.error(`Error loading from localStorage:`, error);
      return this.getDefaultData(filename);
    }
  }

  /**
   * 기본 데이터 반환
   * @param {string} filename - 파일명
   * @returns {Object} - 기본 데이터
   */
  getDefaultData(filename) {
    if (filename === 'photos.json') {
      return {
        photos: [],
        lastUpdated: Date.now(),
        version: "1.0"
      };
    } else if (filename === 'members.json') {
      // 기본 멤버 데이터 (캐시 클리어 시에도 표시되도록)
      return {
        members: [
          {
            "id": "member-001",
            "name": "작은음표",
            "role": "길드마스터",
            "cover": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
            "avatar": "라",
            "joinDate": 1704067200000,
            "status": "active",
            "description": "NBTI 길드의 길드마스터",
            "tags": ["길드마스터", "리더", "던전"],
            "loginId": "smallnote",
            "password": "guildmaster123",
            "email": "smallnote@nbti.com",
            "lastLogin": 0,
            "profile": {
              "bio": "NBTI 길드의 길드마스터입니다. 함께 즐거운 게임을 해요!",
              "interests": ["던전", "레이드", "길드 관리"],
              "gameLevel": 60,
              "favoriteActivity": "던전 공략"
            }
          },
          {
            "id": "member-002",
            "name": "아쉬운데잉",
            "role": "부길드장",
            "cover": "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=250&fit=crop",
            "avatar": "아",
            "joinDate": 1703980800000,
            "status": "active",
            "description": "부길드장",
            "tags": ["부길드장", "서포터", "정모"],
            "loginId": "ashy",
            "password": "ashy123",
            "email": "ashy@nbti.com",
            "lastLogin": 0,
            "profile": {
              "bio": "부길드장으로 길드원들을 도와드립니다!",
              "interests": ["정모", "친목", "서포터"],
              "gameLevel": 58,
              "favoriteActivity": "길드원들과의 정모"
            }
          },
          {
            "id": "member-003",
            "name": "돌하나",
            "role": "부길드장",
            "cover": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=250&fit=crop",
            "avatar": "돌",
            "joinDate": 1703894400000,
            "status": "active",
            "description": "부길드장",
            "tags": ["부길드장", "레이드", "친목"],
            "loginId": "dol",
            "password": "dol123",
            "email": "dol@nbti.com",
            "lastLogin": 0,
            "profile": {
              "bio": "부길드장으로 활발하게 활동합니다!",
              "interests": ["레이드", "친목", "게임"],
              "gameLevel": 55,
              "favoriteActivity": "레이드 파티"
            }
          },
          {
            "id": "member-004",
            "name": "전사도로롱",
            "role": "부길드장",
            "cover": "",
            "avatar": "전",
            "joinDate": 1703808000000,
            "status": "active",
            "description": "부길드장",
            "tags": ["부길드장", "전사", "친화력"],
            "loginId": "doro",
            "password": "doro123",
            "email": "doro@nbti.com",
            "lastLogin": 0,
            "profile": {
              "bio": "전사 부길드장입니다. 잘 부탁드려요!",
              "interests": ["전사", "게임", "학습"],
              "gameLevel": 45,
              "favoriteActivity": "길드원들과의 대화"
            }
          },
          {
            "id": "member-005",
            "name": "이시후",
            "role": "길드원",
            "cover": "",
            "avatar": "이",
            "joinDate": 1703721600000,
            "status": "active",
            "description": "길드원",
            "tags": ["길드원", "게임", "커뮤니티"],
            "loginId": "sihu",
            "password": "sihu123",
            "email": "sihu@nbti.com",
            "lastLogin": 0,
            "profile": {
              "bio": "게임과 커뮤니티 활동을 좋아하는 길드원입니다.",
              "interests": ["게임", "커뮤니티", "친목"],
              "gameLevel": 52,
              "favoriteActivity": "커뮤니티 활동"
            }
          }
        ],
        lastUpdated: 1704067200003,
        version: "1.0"
      };
    }
    return {};
  }

  /**
   * 데이터를 localStorage에 백업 저장
   * @param {string} filename - 파일명
   * @param {Object} data - 저장할 데이터
   */
  saveToLocalStorage(filename, data) {
    const key = filename.replace('.json', '');
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }

  /**
   * 데이터를 JSON 파일에 저장 (localStorage 기반)
   * @param {string} filename - 파일명
   * @param {Object} data - 저장할 데이터
   * @returns {Promise<boolean>} - 저장 성공 여부
   */
  async saveToFile(filename, data) {
    try {
      console.log(`Saving ${filename}:`, data);
      
      // localStorage에 저장 (실제 파일 저장은 수동으로)
      this.saveToLocalStorage(filename, data);
      
      // 콘솔에 업데이트된 데이터 출력
      if (filename === 'members.json') {
        console.log('=== MEMBERS.JSON 업데이트 ===');
        console.log(JSON.stringify(data, null, 2));
        console.log('💡 이 데이터를 data/members.json 파일에 복사하세요.');
      } else if (filename === 'photos.json') {
        console.log('=== PHOTOS.JSON 업데이트 ===');
        console.log(JSON.stringify(data, null, 2));
        console.log('💡 이 데이터를 data/photos.json 파일에 복사하세요.');
      }
      
      return true;
    } catch (error) {
      console.error(`Error saving to file ${filename}:`, error);
      return false;
    }
  }

  /**
   * 사진 데이터 로드
   * @returns {Promise<Array>} - 사진 배열
   */
  async loadPhotos() {
    const data = await this.loadData('photos.json');
    return data.photos || [];
  }

  /**
   * 길드원 데이터 로드
   * @returns {Promise<Array>} - 길드원 배열
   */
  async loadMembers() {
    const data = await this.loadData('members.json');
    return data.members || [];
  }

  /**
   * 사진 추가
   * @param {Object} photoData - 사진 데이터
   * @returns {Promise<Object>} - 추가된 사진
   */
  async addPhoto(photoData) {
    const photos = await this.loadPhotos();
    const newPhoto = {
      id: `photo-${Date.now()}`,
      ...photoData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    photos.push(newPhoto);
    
    const dataToSave = { photos, lastUpdated: Date.now(), version: "1.0" };
    
    // JSON 파일에 저장 (내부적으로 localStorage도 저장)
    await this.saveToFile('photos.json', dataToSave);
    
    // 강력한 캐시 무효화
    this.cache.delete('photos.json');
    this.cache.clear();
    
    console.log(`Photo added, cache cleared`);
    
    return newPhoto;
  }

  /**
   * 길드원 추가
   * @param {Object} memberData - 길드원 데이터
   * @returns {Promise<Object>} - 추가된 길드원
   */
  async addMember(memberData) {
    const members = await this.loadMembers();
    const newMember = {
      id: `member-${Date.now()}`,
      ...memberData,
      joinDate: Date.now(),
      status: 'active'
    };
    
    members.push(newMember);
    
    const dataToSave = { members, lastUpdated: Date.now(), version: "1.0" };
    
    // JSON 파일에 저장 (내부적으로 localStorage도 저장)
    await this.saveToFile('members.json', dataToSave);
    
    // 강력한 캐시 무효화
    this.cache.delete('members.json');
    this.cache.clear();
    
    console.log(`Member added, cache cleared`);
    
    return newMember;
  }

  /**
   * 사진 삭제
   * @param {string} photoId - 사진 ID
   * @returns {Promise<boolean>} - 삭제 성공 여부
   */
  async deletePhoto(photoId) {
    const photos = await this.loadPhotos();
    const filteredPhotos = photos.filter(photo => photo.id !== photoId);
    
    if (filteredPhotos.length === photos.length) {
      return false; // 삭제할 사진이 없음
    }
    
    const dataToSave = { photos: filteredPhotos, lastUpdated: Date.now(), version: "1.0" };
    
    // JSON 파일에 저장 (내부적으로 localStorage도 저장)
    await this.saveToFile('photos.json', dataToSave);
    
    // 강력한 캐시 무효화
    this.cache.delete('photos.json');
    this.cache.clear();
    
    console.log(`Photo ${photoId} deleted, cache cleared`);
    
    return true;
  }

  /**
   * 길드원 삭제
   * @param {string} memberId - 길드원 ID
   * @returns {Promise<boolean>} - 삭제 성공 여부
   */
  async deleteMember(memberId) {
    const members = await this.loadMembers();
    const filteredMembers = members.filter(member => member.id !== memberId);
    
    if (filteredMembers.length === members.length) {
      return false; // 삭제할 길드원이 없음
    }
    
    const dataToSave = { members: filteredMembers, lastUpdated: Date.now(), version: "1.0" };
    
    // JSON 파일에 저장 (내부적으로 localStorage도 저장)
    await this.saveToFile('members.json', dataToSave);
    
    // 강력한 캐시 무효화
    this.cache.delete('members.json');
    this.cache.clear();
    
    console.log(`Member ${memberId} deleted, cache cleared`);
    
    return true;
  }

  /**
   * 사진 업데이트
   * @param {string} photoId - 사진 ID
   * @param {Object} updateData - 업데이트할 데이터
   * @returns {Promise<Object|null>} - 업데이트된 사진 또는 null
   */
  async updatePhoto(photoId, updateData) {
    const photos = await this.loadPhotos();
    const photoIndex = photos.findIndex(photo => photo.id === photoId);
    
    if (photoIndex === -1) {
      return null;
    }
    
    photos[photoIndex] = {
      ...photos[photoIndex],
      ...updateData,
      updatedAt: Date.now()
    };
    
    const dataToSave = { photos, lastUpdated: Date.now(), version: "1.0" };
    
    // JSON 파일에 저장 (내부적으로 localStorage도 저장)
    await this.saveToFile('photos.json', dataToSave);
    
    // 강력한 캐시 무효화
    this.cache.delete('photos.json');
    this.cache.clear();
    
    console.log(`Photo ${photoId} updated, cache cleared`);
    
    return photos[photoIndex];
  }

  /**
   * 길드원 업데이트
   * @param {string} memberId - 길드원 ID
   * @param {Object} updateData - 업데이트할 데이터
   * @returns {Promise<Object|null>} - 업데이트된 길드원 또는 null
   */
  async updateMember(memberId, updateData) {
    const members = await this.loadMembers();
    const memberIndex = members.findIndex(member => member.id === memberId);
    
    if (memberIndex === -1) {
      return null;
    }
    
    members[memberIndex] = {
      ...members[memberIndex],
      ...updateData
    };
    
    const dataToSave = { members, lastUpdated: Date.now(), version: "1.0" };
    
    // JSON 파일에 저장 (내부적으로 localStorage도 저장)
    await this.saveToFile('members.json', dataToSave);
    
    // 강력한 캐시 무효화 - 모든 관련 캐시 삭제
    this.cache.delete('members.json');
    this.cache.clear(); // 전체 캐시 클리어로 확실한 동기화 보장
    
    console.log(`Member ${memberId} updated, cache cleared`);
    
    return members[memberIndex];
  }

  /**
   * 캐시 클리어
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * JSON 파일 다운로드
   * @param {string} filename - 파일명
   * @param {Object} data - 다운로드할 데이터
   */
  downloadJSONFile(filename, data) {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      console.log(`${filename} 파일이 다운로드되었습니다.`);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
    }
  }

  /**
   * 통계 정보 가져오기
   * @returns {Promise<Object>} - 통계 정보
   */
  async getStats() {
    const [photos, members] = await Promise.all([
      this.loadPhotos(),
      this.loadMembers()
    ]);

    return {
      photoCount: photos.length,
      memberCount: members.length,
      lastUpdated: Math.max(
        photos.length > 0 ? Math.max(...photos.map(p => p.updatedAt || p.createdAt)) : 0,
        members.length > 0 ? Math.max(...members.map(m => m.joinDate)) : 0
      )
    };
  }
}

// 전역 인스턴스 생성
window.dataManager = new DataManager();

// 디버깅을 위한 전역 함수들
window.debugDataManager = {
  clearAllCache: () => {
    dataManager.clearCache();
    localStorage.removeItem('members');
    localStorage.removeItem('photos');
    console.log('모든 캐시와 localStorage가 클리어되었습니다.');
  },
  showCacheStatus: () => {
    console.log('현재 캐시 상태:', dataManager.cache);
    console.log('localStorage members:', localStorage.getItem('members'));
    console.log('localStorage photos:', localStorage.getItem('photos'));
  },
  forceReload: async () => {
    dataManager.clearCache();
    const members = await dataManager.loadMembers();
    console.log('강제 리로드된 멤버들:', members);
    return members;
  },
  restoreFromJSON: async () => {
    try {
      // JSON 파일에서 직접 데이터 로드
      const response = await fetch('./data/members.json');
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('members', JSON.stringify(data));
        dataManager.clearCache();
        console.log('JSON 파일에서 데이터를 복원했습니다:', data);
        return data;
      } else {
        console.error('JSON 파일 로드 실패:', response.status);
      }
    } catch (error) {
      console.error('JSON 파일 복원 오류:', error);
    }
  },
  testDataFlow: async () => {
    console.log('=== 데이터 플로우 테스트 ===');
    
    // 1. 캐시 상태 확인
    console.log('1. 캐시 상태:', dataManager.cache.size);
    
    // 2. localStorage 상태 확인
    const localMembers = localStorage.getItem('members');
    console.log('2. localStorage members:', localMembers ? '있음' : '없음');
    
    // 3. JSON 파일 직접 로드
    try {
      const response = await fetch('./data/members.json');
      const jsonData = await response.json();
      console.log('3. JSON 파일 직접 로드:', jsonData.members.length, '명');
    } catch (error) {
      console.log('3. JSON 파일 로드 실패:', error.message);
    }
    
    // 4. dataManager를 통한 로드
    const members = await dataManager.loadMembers();
    console.log('4. dataManager 로드:', members.length, '명');
    
    return members;
  }
};

// 유틸리티 함수들
window.utils = {
  /**
   * 날짜 포맷팅
   * @param {number} timestamp - 타임스탬프
   * @returns {string} - 포맷된 날짜
   */
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}주 전`;
    
    const pad = n => String(n).padStart(2, '0');
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
  },

  /**
   * HTML 이스케이프
   * @param {string} text - 이스케이프할 텍스트
   * @returns {string} - 이스케이프된 텍스트
   */
  escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;", 
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m]));
  },

  /**
   * 고유 ID 생성
   * @returns {string} - 고유 ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};
