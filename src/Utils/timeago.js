
export function timeAgo(time) {
    const now = new Date();
    const pastTime = new Date(time);
  
    const diffSeconds = Math.floor((now - pastTime) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays > 0) {
      // 날짜를 '년/월/일' 형식으로 변환
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return pastTime.toLocaleDateString('ko-KR', options); 
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minutes ago`;
    } else {
      return `${diffSeconds} seconds ago`;
    }
  }

  export function formatTime(time) {
    const now = new Date();
    const pastTime = new Date(time);
  
    const isSameDay = now.toDateString() === pastTime.toDateString();
  
    if (isSameDay) {
      const options = { hour: '2-digit', minute: '2-digit' };
      return pastTime.toLocaleTimeString('ko-KR', options);
    } else {
      const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const timeOptions = { hour: '2-digit', minute: '2-digit' };
      const date = pastTime.toLocaleDateString('ko-KR', dateOptions);
      const time = pastTime.toLocaleTimeString('ko-KR', timeOptions);
      return `${date} ${time}`;
    }
  }