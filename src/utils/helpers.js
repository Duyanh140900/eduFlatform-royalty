/**
 * Các hàm tiện ích
 */

/**
 * Kiểm tra giá trị là null hoặc undefined
 */
const isNullOrUndefined = (value) => {
  return value === null || value === undefined;
};

/**
 * Tính toán thời gian bắt đầu dựa vào khoảng thời gian
 */
const getStartDateByTimeRange = (timeRange) => {
  const now = new Date();
  let startDate = new Date();

  if (timeRange === "day") {
    // Ngày hôm qua (T-1)
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);
  } else if (timeRange === "week") {
    // Tuần hiện tại cộng dồn đến ngày T-1
    const day = startDate.getDay();
    startDate.setDate(startDate.getDate() - day + (day === 0 ? -6 : 1)); // Lấy thứ 2 đầu tuần
    startDate.setHours(0, 0, 0, 0);
  } else if (timeRange === "month") {
    // Tháng hiện tại cộng dồn đến ngày T-1
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
  }

  return startDate;
};

/**
 * Tính toán thời gian kết thúc dựa vào khoảng thời gian
 */
const getEndDateByTimeRange = (timeRange) => {
  const now = new Date();
  let endDate = new Date();

  // T-1 (ngày hôm qua)
  endDate.setDate(endDate.getDate() - 1);
  endDate.setHours(23, 59, 59, 999);

  return endDate;
};

/**
 * Format ngày giờ
 */
const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  return { start, end };
}

function getThisWeekRange() {
  const now = new Date();

  // Tính thứ trong tuần (0 = Chủ Nhật, 1 = Thứ Hai, ..., 6 = Thứ Bảy)
  const currentDay = now.getDay();
  const distanceToMonday = (currentDay + 6) % 7; // chuyển Chủ Nhật thành 6, Thứ Hai thành 0

  // Tính ngày đầu tuần (Thứ Hai)
  const start = new Date(now);
  start.setDate(now.getDate() - distanceToMonday);
  start.setHours(0, 0, 0, 0);

  // Ngày cuối tuần (Chủ Nhật)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function getThisMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { start, end };
}

function getThisYearRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { start, end };
}

module.exports = {
  isNullOrUndefined,
  getStartDateByTimeRange,
  getEndDateByTimeRange,
  formatDate,
  getTodayRange,
  getThisWeekRange,
  getThisMonthRange,
  getThisYearRange,
};
