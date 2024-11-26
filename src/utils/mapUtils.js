export const showFacilityInfo = (facility, type) => {
  const baseStyle = `
    padding: 8px;
    max-width: 200px;
    word-break: keep-all;
    word-wrap: break-word;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  const titleStyle = `
    font-size: 14px;
    font-weight: 600;
    color: #0a362f;
    margin-bottom: 4px;
  `;
  
  const contentStyle = `
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  `;

  switch(type) {
    case 'hospital':
      return `
        <div style="${baseStyle}">
          <div style="${titleStyle}">${facility.name}</div>
          <div style="${contentStyle}">
            <p style="margin: 4px 0;">${facility.address || ''}</p>
            <p style="margin: 4px 0;">병원 분류: ${facility.category || '정보없음'}</p>
            <p style="margin: 4px 0;">전화번호: ${facility.tel || '정보없음'}</p>
          </div>
        </div>
      `;
    
    case 'market':
      return `
        <div style="${baseStyle}">
          <div style="${titleStyle}">${facility.name}</div>
          <div style="${contentStyle}">
            <p style="margin: 4px 0;">${facility.address || ''}</p>
            <p style="margin: 4px 0;">영업 분류: ${facility.category || '정보없음'}</p>
          </div>
        </div>
      `;
    
    case 'subway':
      return `
        <div style="${baseStyle}">
          <div style="${titleStyle}">${facility.name}역</div>
          <div style="${contentStyle}">
            <p style="margin: 4px 0;">${facility.line || ''}호선</p>
          </div>
        </div>
      `;
    
    case 'school':
      return `
        <div style="${baseStyle}">
          <div style="${titleStyle}">${facility.name}</div>
          <div style="${contentStyle}">
            <p style="margin: 4px 0;">학교 분류: ${facility.category || '정보없음'}</p>
            <p style="margin: 4px 0;">설립 분류: ${facility.type || '정보없음'}</p>
            <p style="margin: 4px 0;">${facility.address || ''}</p>
          </div>
        </div>
      `;
    
    default:
      return '';
  }
};

export const createMarkerImage = (type) => {
  const imageSize = new kakao.maps.Size(36, 36);
  let imageSrc;
  switch(type) {
    case 'hospital':
      imageSrc = '/images/hospital.svg';
      break;
    case 'market':
      imageSrc = '/images/supermarket.svg';
      break;
    case 'subway':
      imageSrc = '/images/subway.svg';
      break;
    case 'school':
      imageSrc = '/images/school.svg';
      break;
  }
  
  return new kakao.maps.MarkerImage(imageSrc, imageSize);
}; 