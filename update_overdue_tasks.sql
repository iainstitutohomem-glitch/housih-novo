
-- Function to update overdue tasks automatically
-- This moves tasks with past due dates to the 'Atrasado' status and its corresponding column.
-- It skips tasks that are already 'Concluído' or 'Cancelado'.

CREATE OR REPLACE FUNCTION update_overdue_tasks()
RETURNS VOID AS $$
DECLARE
    v_atrasado_col_id UUID;
    v_board_id UUID;
    v_updated_count INTEGER := 0;
BEGIN
    -- Iterate through each board to find its 'Atrasado' column
    FOR v_board_id IN SELECT id FROM boards LOOP
        -- Get the existing 'Atrasado' column ID for this specific board
        SELECT id INTO v_atrasado_col_id 
        FROM board_columns 
        WHERE board_id = v_board_id AND title ILIKE '%Atrasado%' 
        LIMIT 1;

        -- Only update if the 'Atrasado' column exists
        IF v_atrasado_col_id IS NOT NULL THEN
            UPDATE tasks
            SET 
                status = 'Atrasado',
                column_id = v_atrasado_col_id
            WHERE 
                board_id = v_board_id
                AND status NOT IN ('Concluído', 'Cancelado', 'Atrasado')
                AND due_date < CURRENT_DATE;
            
            GET DIAGNOSTICS v_updated_count = ROW_COUNT;
            IF v_updated_count > 0 THEN
                RAISE NOTICE 'Updated % tasks to Atrasado for board %', v_updated_count, v_board_id;
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- To test: SELECT update_overdue_tasks();
