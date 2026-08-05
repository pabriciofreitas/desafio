from app.services.demand_service import calculate_priority


def test_calculate_priority():
    assert calculate_priority(5, 4) == 14
    assert calculate_priority(1, 1) == 3
    assert calculate_priority(2, 5) == 9
