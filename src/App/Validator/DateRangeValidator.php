<?php

namespace App\Validator;


class DateRangeValidator
{
    private $fromDate;
    private $toDate;

    public function __construct(\DateTimeInterface $fromDate, \DateTimeInterface $toDate)
    {
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
    }

    /**
     * @throws \InvalidArgumentException
     */
    public function validate(
        \DateTimeInterface $date = null): bool
    {
        if (!$date) {
            throw new \InvalidArgumentException('Nie podano daty');
        }

        if($date < $this->fromDate ) {
            throw new \InvalidArgumentException('Nie można wybrać daty wcześniejszej niż: ' . $this->fromDate->format('Y-m-d'));
        }

        if($date > $this->toDate) {
            throw new \InvalidArgumentException('Nie można wybrać daty późniejszej niż: ' . $this->toDate->format('Y-m-d'));
        }

        return true;
    }
}