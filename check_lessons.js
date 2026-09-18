const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://offlrpkfddmhtuycyzpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZmxycGtmZGRtaHR1eWN5enB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTgwMzAsImV4cCI6MjA4MTQ5NDAzMH0.ypqffWVbb1Z0rPg2WywkNP0t-5nuBOvAyy30Q4qzbzA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLessons() {
  try {
    // Busca todas as lições ordenadas por module_id e order_index
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('id, module_id, title, order_index')
      .order('module_id')
      .order('order_index');
    
    if (error) {
      console.error('Erro ao buscar lições:', error);
      return;
    }
    
    console.log('Total de lições:', lessons.length);
    
    // Verifica lições duplicadas
    const seen = {};
    const duplicates = [];
    
    lessons.forEach(lesson => {
      const key = `${lesson.module_id}-${lesson.title}`;
      if (seen[key]) {
        duplicates.push({
          lesson1: seen[key],
          lesson2: lesson
        });
      } else {
        seen[key] = lesson;
      }
    });
    
    console.log('Lições duplicadas:', duplicates.length);
    
    duplicates.forEach((dup, i) => {
      console.log(`${i+1}. Módulo ${dup.lesson1.module_id}: "${dup.lesson1.title}"`);
      console.log(`   ID ${dup.lesson1.id} (ordem: ${dup.lesson1.order_index}) e ID ${dup.lesson2.id} (ordem: ${dup.lesson2.order_index})`);
    });
    
  } catch (err) {
    console.error('Erro ao executar verificação:', err);
  }
}

checkLessons();