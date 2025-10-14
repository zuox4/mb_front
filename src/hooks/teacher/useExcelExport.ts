import { useCallback } from "react";
import * as XLSX from "xlsx";
import { PivotStudent } from "./useProjectOfficePivot";

interface ExportData {
  students: PivotStudent[];
  fileName?: string;
}

// Функция для сохранения файла
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveFile = (buffer: any, fileName: string) => {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const useExcelExport = () => {
  const exportToExcel = useCallback(
    ({ students, fileName = "students_data" }: ExportData) => {
      if (!students || students.length === 0) {
        alert("Нет данных для выгрузки");
        return;
      }

      try {
        // Создаем новую книгу Excel
        const workbook = XLSX.utils.book_new();

        // Группируем студентов по классам
        const groups = [
          ...new Set(students.map((student) => student.group_name)),
        ];

        // Создаем лист для каждого класса
        groups.forEach((groupName) => {
          const groupStudents = students.filter(
            (student) => student.group_name === groupName
          );

          // Подготавливаем данные для листа
          const worksheetData = prepareGroupSheetData(groupStudents);

          // Создаем лист
          const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

          // Настраиваем ширину колонок
          setupColumnWidths(worksheet, groupStudents);

          // Добавляем объединение ячеек для заголовков мероприятий
          setupCellMerging(worksheet, groupStudents);

          // Добавляем лист в книгу
          const safeSheetName = groupName
            .replace(/[\\/*[\]:?]/g, "")
            .substring(0, 31);
          XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
        });

        // Генерируем файл и скачиваем
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const finalFileName = `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`;
        saveFile(excelBuffer, finalFileName);
      } catch (error) {
        console.error("Ошибка при выгрузке в Excel:", error);
        alert("Произошла ошибка при выгрузке файла");
      }
    },
    []
  );

  return { exportToExcel };
};

// Функция для настройки ширины колонок
const setupColumnWidths = (
  worksheet: XLSX.WorkSheet,
  students: PivotStudent[]
) => {
  // Создаем массив колонок если его нет
  if (!worksheet["!cols"]) {
    worksheet["!cols"] = [];
  }

  // Базовая ширина для колонки с ФИО
  worksheet["!cols"].push({ wch: 25 }); // ФИО ученика

  // Определяем максимальное количество этапов среди всех мероприятий
  const maxStagesPerEvent = getMaxStagesPerEvent(students);

  // Для каждого мероприятия добавляем колонки под этапы
  if (students.length > 0) {
    const eventIds = Object.keys(students[0].events);
    eventIds.forEach(() => {
      // Для каждого мероприятия добавляем колонки под все возможные этапы
      for (let i = 0; i < maxStagesPerEvent; i++) {
        if (!worksheet["!merges"]) {
          worksheet["!merges"] = [];
        }
      }
    });
  }
};

// Функция для настройки объединения ячеек
const setupCellMerging = (
  worksheet: XLSX.WorkSheet,
  students: PivotStudent[]
) => {
  // Создаем массив объединений если его нет
  if (!worksheet["!merges"]) {
    worksheet["!merges"] = [];
  }

  const eventIds = students.length > 0 ? Object.keys(students[0].events) : [];
  const maxStagesPerEvent = getMaxStagesPerEvent(students);

  let currentCol = 1; // Начинаем с колонки B (после ФИО)

  // Объединяем заголовки мероприятий (строка 4)
  eventIds.forEach(() => {
    if (maxStagesPerEvent > 1) {
      // Создаем новый массив объединений чтобы избежать мутации
      const newMerges = [
        ...(worksheet["!merges"] || []),
        {
          s: { r: 3, c: currentCol }, // Строка 4, текущая колонка
          e: { r: 3, c: currentCol + maxStagesPerEvent - 1 }, // Объединяем на maxStagesPerEvent колонок
        },
      ];
      worksheet["!merges"] = newMerges;
    }
    currentCol += maxStagesPerEvent;
  });
};

// Функция для получения максимального количества этапов в одном мероприятии
const getMaxStagesPerEvent = (students: PivotStudent[]): number => {
  let maxStages = 0;
  students.forEach((student) => {
    Object.values(student.events).forEach((event) => {
      if (event.stages && event.stages.length > maxStages) {
        maxStages = event.stages.length;
      }
    });
  });
  return maxStages;
};

// Функция для подготовки данных листа класса
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prepareGroupSheetData = (students: PivotStudent[]): any[][] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[][] = [];

  // Заголовок
  data.push(["Отчет по классу", students[0]?.group_name || ""]);
  data.push(["Дата выгрузки", new Date().toLocaleDateString("ru-RU")]);
  data.push([]);

  // Получаем список всех мероприятий
  const eventIds = students.length > 0 ? Object.keys(students[0].events) : [];
  const maxStagesPerEvent = getMaxStagesPerEvent(students);

  // Создаем сложные заголовки для мероприятий и этапов
  const headers = ["ФИО ученика"];

  // Для каждого мероприятия создаем группу колонок под этапы
  eventIds.forEach((eventId) => {
    const event = students[0]?.events[eventId];
    const eventName = event?.event_name || "Мероприятие";

    // Добавляем основной заголовок мероприятия (объединяющий все его этапы)
    headers.push(eventName);

    // Добавляем пустые заголовки для объединения ячеек
    for (let i = 1; i < maxStagesPerEvent; i++) {
      headers.push("");
    }
  });

  data.push(headers);

  // Вторая строка заголовков - названия этапов
  const stageHeaders = [""]; // Пусто под "ФИО ученика"

  eventIds.forEach((eventId) => {
    const event = students[0]?.events[eventId];
    const stages = event?.stages || [];

    // Добавляем названия этапов
    stages.forEach((stage) => {
      stageHeaders.push(stage.name);
    });

    // Добавляем пустые ячейки если этапов меньше максимального
    const emptySlots = maxStagesPerEvent - stages.length;
    for (let i = 0; i < emptySlots; i++) {
      stageHeaders.push("");
    }
  });

  data.push(stageHeaders);

  // Третья строка заголовков - статусы
  const statusHeaders = [""]; // Пусто под "ФИО ученика"

  eventIds.forEach((eventId) => {
    const event = students[0]?.events[eventId];
    const stages = event?.stages || [];

    // Добавляем подзаголовки "Статус" для каждого этапа
    stages.forEach(() => {
      statusHeaders.push("Статус");
    });

    // Добавляем пустые ячейки если этапов меньше максимального
    const emptySlots = maxStagesPerEvent - stages.length;
    for (let i = 0; i < emptySlots; i++) {
      statusHeaders.push("");
    }
  });

  data.push(statusHeaders);

  // Данные студентов - только статусы
  students.forEach((student) => {
    const row = [student.student_name];

    eventIds.forEach((eventId) => {
      const event = student.events[eventId];

      if (event && event.stages) {
        // Добавляем СТАТУСЫ по каждому этапу
        event.stages.forEach((stage) => {
          row.push(stage.status); // Только статус: "зачет" или "незачет"
        });

        // Добавляем пустые ячейки если этапов меньше максимального
        const emptySlots = maxStagesPerEvent - event.stages.length;
        for (let i = 0; i < emptySlots; i++) {
          row.push("");
        }
      } else {
        // Если нет данных о мероприятии, добавляем пустые ячейки для всех этапов
        for (let i = 0; i < maxStagesPerEvent; i++) {
          row.push("Нет данных");
        }
      }
    });

    data.push(row);
  });

  return data;
};
